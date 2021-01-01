public class GenericUtility {
    
    public static List<Schema.FieldSetMember> getFieldSet(String fieldSetName, String sObjectName)
    {
        Map<String, Schema.SObjectType> GlobalDescribeMap = Schema.getGlobalDescribe(); 
        Schema.SObjectType SObjectTypeObj = GlobalDescribeMap.get(sObjectName);
        Schema.DescribeSObjectResult DescribeSObjectResultObj = SObjectTypeObj.getDescribe();
        
        //system.debug('====>' + DescribeSObjectResultObj.FieldSets.getMap().get(fieldSetName));
        
        Schema.FieldSet fieldSetObj = DescribeSObjectResultObj.FieldSets.getMap().get(fieldSetName);
        
        //List<Schema.FieldSetMember> fieldSetMemberList =  fieldSetObj.getFields();
        //system.debug('fieldSetMemberList ====>' + fieldSetMemberList);  
        return fieldSetObj.getFields(); 
    }  

}