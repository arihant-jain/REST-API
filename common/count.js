function checkCount(count){
    if(!isNaN(count)){
        if(count > 0 && count < 100000){
            return true;
        }
    }
    return false;
}

module.exports = {checkCount};