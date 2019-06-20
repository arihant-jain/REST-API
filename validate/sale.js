var saleArray = [];
function checkDuplicate(cup_id){
    if(saleArray.length != 0){
        // Get current date time
        date = new Date();
        // To get time 3 minutes ago
        date.setMinutes(date.getMinutes() - 10);

        // Delete all cup ids saved more than 3 minutes ago
        for(var index = 0; index < saleArray.length; index++){
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

module.exports = {checkDuplicate};