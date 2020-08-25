var returnArray = [];
var returnCacheArray = [];

function checkDuplicate(cup_id){
    if(returnArray.length != 0){

        // Sort returnArray by date-times saved in it
        returnArray.sort(function(a,b){
            return a[1] - b[1];
        })

        // Get current date time
        date = new Date();
        // To get time 30 minutes ago
        date.setMinutes(date.getMinutes() - 30);

        // Delete all cup ids saved more than 30 minutes ago
        index = 0
        while(index < returnArray.length){
            if(returnArray[index][1] <= date){
                returnArray.splice(index, 1)
            }
            else{
                // All further entries will be after 'date' variable time, thus break
                break
            }
        }

        // Check if cup id already saved
        var flag = false
        for(index = 0; index < returnArray.length; index++){
            if(returnArray[index].includes(cup_id) == true){
                flag = true
                break
            }
        }
        if(flag == false){
            returnArray.push([cup_id, new Date()])
        }
        return flag
    }
    else{
        returnArray.push([cup_id, new Date()])
        return false
    }
}

function checkCacheDuplicate(cup_id, dateTime){
    if(returnCacheArray.length != 0){

        // Sort returnCacheArray by date-times saved in it
        returnCacheArray.sort(function(a,b){
            return a[1] - b[1];
        })

        // Get date time
        date = new Date(dateTime);
        // To get time 30 minutes ago
        date.setMinutes(date.getMinutes() - 30);

        // Delete all cup ids saved more than 30 minutes ago
        index = 0
        while(index < returnCacheArray.length){
            if(returnCacheArray[index][1] <= date){
                returnCacheArray.splice(index, 1)
            }
            else{
                // All further entries will be after 'date' variable time, thus break
                break
            }
        }

        // Check if cup id already saved
        var flag = false
        for(index = 0; index < returnCacheArray.length; index++){
            if(returnCacheArray[index].includes(cup_id) == true){
                flag = true
                break
            }
        }
        if(flag == false){
            returnCacheArray.push([cup_id, new Date(dateTime)])
        }
        return flag
    }
    else{
        returnCacheArray.push([cup_id, new Date(dateTime)])
        return false
    }
}

module.exports = {checkDuplicate, checkCacheDuplicate};