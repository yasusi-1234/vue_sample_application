export function sortObj(objectArray, keyName){
    objectArray.sort((a, b) =>{
        if(a[keyName] < b[keyName]){
            return -1
        }else{
            return 1
        }
    })
}

export function sortObjReverse(objectArray, keyName){
    objectArray.sort((a, b) =>{
        if(a[keyName] < b[keyName]){
            return 1
        }else{
            return -1
        }
    })
}

export function betweenSpecifyDate(specifyDate){
    const now = new Date()
    if(specifyDate === 'thisMonth'){
         // 月初の日
        const beginningOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
        // 月末の日の終わり
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, -1)
        return {start: beginningOfMonth.getTime(), end: endOfMonth.getTime()}
    }

    if(specifyDate === 'thisWeek'){
         // 始まり
        const dayOfWeek = now.getDay()
        const beginningWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek)
        // 終わり
        const endOfWeek = new Date(now.getFullYear(), now.getMonth(), beginningWeek.getDate() + 7, 0, 0, 0, -1)
        return {start: beginningWeek.getTime(), end: endOfWeek.getTime()}
    }

    if(specifyDate === 'today'){
         // 本日の始まりの時間
         const beginningDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
         // 本日の終わりの時間
         const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, -1)
         return {start: beginningDay.getTime(), end: endOfDay.getTime()}
    }

    if(specifyDate === 'thisYear'){
         // 今年の始まり
         const beginningYear = new Date(now.getFullYear(),0)
         // 今年の終わり
         const endOfYear = new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0, -1)
         return {start: beginningYear.getTime(), end: endOfYear.getTime()}
    }

    return undefined;
}

//  // 本日
//  const now = new Date();
//  // 月初の日
//  const beginningOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
//  // 月末の日の終わり
//  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, -1)
//  console.log(now.toLocaleString())
//  console.log(beginningOfMonth.toLocaleString())
//  console.log(endOfMonth.toLocaleString())
//  console.log('###')
//  // 本日の始まりの時間
//  const beginningDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//  // 本日の終わりの時間
//  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, -1)
//  console.log(beginningDay.toLocaleString())
//  console.log(endOfDay.toLocaleString())
//  console.log('###')
//  // 今年の始まり
//  const beginningYear = new Date(now.getFullYear(),0)
//  // 今年の終わり
//  const endOfYear = new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0, -1)
//  console.log(beginningYear.toLocaleString())
//  console.log(endOfYear.toLocaleString())
//  console.log('###')
//  // 今週一週間の取得
//  // 始まり
//  let dayOfWeek = now.getDay()
//  const beginningWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - dayOfWeek)
//  console.log(beginningWeek.toLocaleString())
//  // 終わり
//  const endOfWeek = new Date(now.getFullYear(), now.getMonth(), beginningWeek.getDate() + 7, 0, 0, 0, -1)
//  console.log(endOfWeek.toLocaleString())