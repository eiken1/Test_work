function findHighestProduct (list) {

    let result = list.sort((a,b)=>b-a).reduce((total, value, index) => index < 3 ? total*value : total);

    console.log(result);


    let resultDiv = document.querySelector("#functionDiv");
    div = document.createElement("div");
    div.textContent = result;
    resultDiv.appendChild(div);
}

findHighestProduct([1, 10, 2, 6, 5, 3]);
findHighestProduct([1, 10, 2, 6, 5, 100]);
findHighestProduct([1, 14, 2, 6, 500, 100]);
findHighestProduct([2, 3, 4, 5, 6, 7, 8, 9]);
findHighestProduct([5, 25, 47, 43, 93, 74]);

