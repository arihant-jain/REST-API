var saleArray = [];
var saleCacheArray = [];

function checkDuplicate(cup_id){
    if(saleArray.length != 0){

        // Sort saleArray by date-times saved in it
        saleArray.sort(function(a,b){
            return a[1] - b[1];
        })

        // Get current date time
        date = new Date();
        // To get time 30 minutes ago
        date.setMinutes(date.getMinutes() - 30);

        // Delete all cup ids saved more than 30 minutes ago
        index = 0
        while(index < saleArray.length){
            if(saleArray[index][1] <= date){
                saleArray.splice(index, 1)
            }
            else{
                // All further entries will be after 'date' variable time, thus break
                break
            }
        }

        // Check if cup id already saved
        var flag = false
        for(index = 0; index < saleArray.length; index++){
            if(saleArray[index].includes(cup_id) == true){
                flag = true
                break
            }
        }
        if(flag == false){
            saleArray.push([cup_id, new Date()])
        }
        return flag
    }
    else{
        saleArray.push([cup_id, new Date()])
        return false
    }
}

function checkCacheDuplicate(cup_id, dateTime){
    if(saleCacheArray.length != 0){

        // Sort saleArray by date-times saved in it
        saleCacheArray.sort(function(a,b){
            return a[1] - b[1];
        })

        // Get date time
        date = new Date(dateTime);
        // To get time 30 minutes ago
        date.setMinutes(date.getMinutes() - 30);

        // Delete all cup ids saved more than 30 minutes ago
        index = 0
        while(index < saleCacheArray.length){
            if(saleCacheArray[index][1] <= date){
                saleCacheArray.splice(index, 1)
            }
            else{
                // All further entries will be after 'date' variable time, thus break
                break
            }
        }

        // Check if cup id already saved
        var flag = false
        for(index = 0; index < saleCacheArray.length; index++){
            if(saleCacheArray[index].includes(cup_id) == true){
                flag = true
                break
            }
        }
        if(flag == false){
            saleCacheArray.push([cup_id, new Date(dateTime)])
        }
        return flag
    }
    else{
        saleCacheArray.push([cup_id, new Date(dateTime)])
        return false
    }
}

module.exports = {checkDuplicate, checkCacheDuplicate};