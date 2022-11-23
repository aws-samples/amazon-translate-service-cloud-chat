import { Stack, StackProps } from 'aws-cdk-lib';
import { IResource, LambdaIntegration, MockIntegration, PassthroughBehavior, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';
import * as iam from 'aws-cdk-lib/aws-iam';
import { ManagedPolicy } from 'aws-cdk-lib/aws-iam';

export class AwsTranslationStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: [
          'aws-sdk', // Use the 'aws-sdk' available in the Lambda runtime
        ],
      },
      depsLockFilePath: join(__dirname, '..', 'package-lock.json'),
      runtime: Runtime.NODEJS_14_X,
    }

    const translateTextLambda = new NodejsFunction(this, 'translateTextFunction', {
      entry: join(__dirname, '../src', 'TranslateText.js'),
      ...nodeJsFunctionProps,
    });

    translateTextLambda.role?.addManagedPolicy(
      ManagedPolicy.fromAwsManagedPolicyName('TranslateReadOnly')
    );

    const api = new RestApi(this, 'translationApi', {
      restApiName: 'Translation Service'
    });

    const key = api.addApiKey('ApiKey', {
      apiKeyName: 'msl-translate-demo-api-key1'
    });
  
    const translationIntegration = new LambdaIntegration(translateTextLambda);

    const items = api.root.addResource('translate');
    items.addMethod('POST', translationIntegration, {
      apiKeyRequired: true
    });

    addCorsOptions(items);
  }
  
  
}

export function addCorsOptions(apiResource: IResource) {
  apiResource.addMethod('OPTIONS', new MockIntegration({
    integrationResponses: [{
      statusCode: '200',
      responseParameters: {
        'method.response.header.Access-Control-Allow-Headers': "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,X-Amz-User-Agent'",
        'method.response.header.Access-Control-Allow-Origin': "'*'",
        'method.response.header.Access-Control-Allow-Credentials': "'false'",
        'method.response.header.Access-Control-Allow-Methods': "'OPTIONS,GET,PUT,POST,DELETE'",
      },
    }],
    passthroughBehavior: PassthroughBehavior.NEVER,
    requestTemplates: {
      "application/json": "{\"statusCode\": 200}"
    },
  }), {
    methodResponses: [{
      statusCode: '200',
      responseParameters: {
        'method.response.header.Access-Control-Allow-Headers': true,
        'method.response.header.Access-Control-Allow-Methods': true,
        'method.response.header.Access-Control-Allow-Credentials': true,
        'method.response.header.Access-Control-Allow-Origin': true,
      },
    }]
  })
}
