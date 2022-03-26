const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

var date = new Date();
var month = months[date.getMonth()];
var year = date.getFullYear();

document.querySelector('.date').textContent = `Available Budget In ${month} ${year} :`;

// --------------------------- Trenutni datum za header ----------------------------------------

var availableNow = document.querySelector('.available-budget');
var incomeHead = document.querySelector('.income-amount');
var expenseHead = document.querySelector('.expense-amount');
var percentHead = document.querySelector('.percent');
// ----------------- End head Section elements---------------------
var minusPlus = document.querySelector('#plus-or-minus');
var description = document.querySelector('#description');
var value = document.querySelector('#value');
var sbmtBtn = document.querySelector('.submit-btn')
// ----------------- End form section elements -------------------
var incomeItems = document.querySelector('.income-items');
var expenseItems = document.querySelector('.expense-items')
// ----------------- Income Expense DIV s -------------------------
// ------------------- MAIN JS ------------------------------------

let incSum = 0;
var expSum = 0;



var incData = JSON.parse(localStorage.getItem('listOfIncome')) || [];
var expData = JSON.parse(localStorage.getItem('listOfExpense')) || [];
var newExpenseElement = function ({description, value}) {
    var expDiv = document.createElement('div');
    expDiv.classList.add('expense-item');
    var expDesrtipton = document.createElement('div');
    expDesrtipton.classList.add('expense-item-description');
    expDesrtipton.innerHTML = description;
    expDiv.appendChild(expDesrtipton);
    var expContent = document.createElement('div');
    expContent.classList.add('expense-item-content');
    expDiv.appendChild(expContent);
    var expValue = document.createElement('div');
    expValue.classList.add('expense-item-value');
    expValue.innerHTML = `- ${parseInt(value).toFixed(2)}`
    expContent.appendChild(expValue)
    var expPercent = document.createElement('div');
    expPercent.classList.add('expense-percent');
    expPercent.innerHTML = `${Math.round((parseInt(value) / incSum) * 100)}%`;
    expContent.appendChild(expPercent);
    var deleteDiv = document.createElement('div');
    deleteDiv.classList.add('delete-item');
    expContent.appendChild(deleteDiv);
    var deleteBtn = document.createElement('button');
    deleteBtn.setAttribute("onclick", `deleteExpItem(event, '${description}', '${value}')`);
    deleteBtn.classList.add('delete-item-btn-exp');
    deleteBtn.innerHTML = '<i class="fa-solid fa-x"></i>';
    deleteDiv.appendChild(deleteBtn);
    expenseItems.appendChild(expDiv);
};
var newIncomeElement = function ({description, value}) {
    var incomeDiv = document.createElement('div');
    incomeDiv.classList.add('income-item');
    var incomeDescription = document.createElement('div');
    incomeDescription.classList.add('income-item-description');
    incomeDescription.innerHTML = description;
    incomeDiv.appendChild(incomeDescription);
    var incomeContent = document.createElement('div');
    incomeContent.classList.add('income-item-content');
    incomeDiv.appendChild(incomeContent);
    var incomeValue = document.createElement('div');
    incomeValue.classList.add('income-item-value');
    incomeValue.innerHTML = `+ ${parseInt(value).toFixed(2)}`;
    incomeContent.appendChild(incomeValue)
    var deleteDiv = document.createElement('div');
    deleteDiv.classList.add('delete-item');
    incomeContent.appendChild(deleteDiv);
    var deleteBtn = document.createElement('button');
    deleteBtn.setAttribute("onclick", `deleteIncItem(event, '${description}', '${value}')`);
    deleteBtn.classList.add('delete-item-btn')
    deleteBtn.innerHTML = '<i class="fa-solid fa-x"></i>';
    deleteDiv.appendChild(deleteBtn);
    incomeItems.appendChild(incomeDiv);
};
var addExpense = function (description, value) {
    expData.push({
        description,
        value
    })

    localStorage.setItem('listOfExpense', JSON.stringify(expData))

    return {description, value}
};

var addIncome = function (description, value){
    incData.push({
        description,
        value
    })

    localStorage.setItem('listOfIncome', JSON.stringify(incData))

    return {description, value}

}


var addIncVal = function () {
    incSum += parseInt(value.value)
    incomeHead.innerHTML = `+ ${incSum.toFixed(2)}`;
    window.location.reload()
}

var addExpVal = function () {
    expSum += parseInt(value.value)
    expenseHead.innerHTML = `- ${expSum.toFixed(2)}`;
    window.location.reload()
}

incData.forEach(function(item){
    incSum += parseInt(item.value) 
})
expData.forEach(function(item){
    expSum += parseInt(item.value) 
})

var submitClick = function () {
    event.preventDefault();
    if(description.value && value.value){
        if(minusPlus.value === 'minus'){
        var newExp = addExpense(
            description.value,
            value.value
        )
            addExpVal()
            newExpenseElement(newExp);
        }else{
            var newInc = addIncome(
            description.value,
            value.value
        )
            addIncVal()
            newIncomeElement(newInc);
        };
    }else{
        alert('Please enter description and value') ;
    };
    description.value = '';
    value.value = '';
}

incData.forEach(newIncomeElement)
expData.forEach(newExpenseElement)

var totalBudget = incSum - expSum;
var percentage = function () {
    if(incSum != 0){
       var percent = Math.round((expSum / incSum) * 100);
       if(totalBudget > 0 || totalBudget < 0){
           percentHead.textContent = `${percent} %`;
       }
   }
   else{
       percentHead.textContent = `--`;
   }

}

var total = function () {    
    // ----------- Income Total -------------
    if(incData){
        incomeHead.textContent = `+ ${incSum.toFixed(2)}`;
    }else if (incSum === 0){
        incomeHead.textContent = 0;
        incSum = incSum + parseInt(value.value); 
    };
    // ----------Expense Total --------------
    if(expData){
        expenseHead.textContent = `- ${expSum.toFixed(2)}`;
    }else if (expSum === 0){
        expenseHead.textContent = 0;
    };
    // --------- Budget total
    if(totalBudget > 0 || totalBudget < 0){
        if(totalBudget < 0){
            availableNow.textContent = totalBudget.toFixed(2);
        }else{
            availableNow.textContent = `+ ${totalBudget.toFixed(2)}`;
        }
    }else{
        availableNow.textContent = '--'
    }

    
}
// ------------- DELETE ITEM --------------------------------------
var deleteIncItem = function (e, description, value) {
    var klik = e.target;
    if(klik.classList[0] === 'delete-item-btn'){
        var k =  klik.parentElement.parentElement.parentElement
        k.remove()
    }

    let elemToDel = {description, value}
    
    incData.forEach(function(elem, index)  {
        console.log(elem)
        console.log(elemToDel)
        if (JSON.stringify(elem) === JSON.stringify(elemToDel)) {
            incData.splice(index, 1)
            localStorage.setItem('listOfIncome',JSON.stringify(incData));
            window.location.reload()
            return
        }
    })
}

var deleteExpItem = function (e, description, value) {
    var klik = e.target;
    if(klik.classList[0] === 'delete-item-btn-exp'){
        var k =  klik.parentElement.parentElement.parentElement
        k.remove()
    }

    let elemToDel = {description, value}
    
    expData.forEach((elem, index) => {
        if (JSON.stringify(elem) === JSON.stringify(elemToDel)) {
            expData.splice(index, 1)
            localStorage.setItem('listOfExpense',JSON.stringify(expData));
            window.location.reload()
            return
        }
    })
}

// ------------- Color change -----------------------------------
var colorChange = function () {
    if (minusPlus.value === 'minus'){
        console.log(minusPlus.value);
        sbmtBtn.style.background = 'rgb(160, 75, 24)';
        description.style.border = '1px solid rgb(160, 75, 24)';
        value.style.border = '1px solid rgb(160, 75, 24)';
    }else{
        console.log(minusPlus.value);
        sbmtBtn.style.background = 'rgb(43, 80, 127)';
        description.style.border = '1px solid rgb(43, 80, 127)';
        value.style.border = '1px solid rgb(43, 80, 127)';
    };
};

percentage(), total()