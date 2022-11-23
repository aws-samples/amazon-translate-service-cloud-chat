//This script will add anyone in the System Administrator profile to the Perm Set 
//needed to access the Amazon Translate service via a named credential
PermissionSet pm = [SELECT Id from PermissionSet WHERE Name = 'TranslateServiceDemo' LIMIT 1];
List<PermissionSetAssignment> psl = new List<PermissionSetAssignment>();
for (User u : [SELECT ID,Profile.Name,IsActive FROM User WHERE Profile.Name = 'System Administrator' AND IsActive = true]){ 
    psl.add(new PermissionSetAssignment (PermissionSetId = pm.Id, AssigneeId = u.Id));
}
Database.insert(psl, false);