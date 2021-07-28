export function sortObj(objectArray, keyName){
    objectArray.sort((a, b) =>{
        if(a[keyName] < b[keyName]){
            return -1
        }else{
            return 1
        }
    })
}

