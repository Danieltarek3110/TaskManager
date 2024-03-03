const add = (a , b) =>{
    return new Promise((resolve , reject)=>{
        setTimeout(()=>{
            resolve(a+b)
        } , 2000)
    })
}

const dowork = async ()=>{
    const sum1 = await add(25 , 60);
    const sum2 = await add(sum1 , 80);
    const sum3 = await add(sum2 , 1)
    return sum3;
    
} 

dowork().then((result)=>{
    console.log(result)
})