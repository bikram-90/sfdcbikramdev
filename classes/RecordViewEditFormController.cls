public class RecordViewEditFormController {
    
    @AuraEnabled
    public static sObject getSObjectRecord(String objectAPIName, String recordId){
        
        System.debug('objectAPIName : ' + objectAPIName + ', recordId : ' + recordId);
        sObject obj = null;
        if(String.isNotBlank(objectAPIName) && String.isNotBlank(recordId)){
            String query = 'SELECT Id FROM ' + objectAPIName + ' WHERE Id = :' + recordId + ' LIMIT 1';
            obj = Database.query(query);
        }   
        
        System.debug('obj : ' + obj);
        return obj;
    }
    
    @AuraEnabled
    public static String getFieldAPINames(String objectAPIName, String fieldSetName){
        
        System.debug('fieldSetName : ' + fieldSetName + ', objectAPIName : ' + objectAPIName);
        Set<String> fieldAPINamesSet = new Set<String>();
        if(String.isNotBlank(fieldSetName) && String.isNotBlank(objectAPIName)){
            List<Schema.FieldSetMember> fieldSetMemberList =  GenericUtility.getFieldSet(fieldSetName,objectAPIName);
            for(Schema.FieldSetMember fieldSetMemberObj : fieldSetMemberList)
            {
                //system.debug('API Name ====>' + fieldSetMemberObj.getFieldPath()); //api name
                fieldAPINamesSet.add(fieldSetMemberObj.getFieldPath());
                //system.debug('Label ====>' + fieldSetMemberObj.getLabel());
                //system.debug('Required ====>' + fieldSetMemberObj.getRequired());
                //system.debug('DbRequired ====>' + fieldSetMemberObj.getDbRequired());
                //system.debug('Type ====>' + fieldSetMemberObj.getType());   //type - STRING,PICKLIST
            }
        }
        System.debug('fieldAPINamesSet : ' + fieldAPINamesSet);
        return JSON.serialize(fieldAPINamesSet);
    }    
    
}