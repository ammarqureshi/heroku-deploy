
//budgetController is an object contatining publicTest function
var budgetController = (function(){ 
  
        
    //Expense function constructor
    var Expense = function(id,description,value){
        
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;
        
    };
    
    
    
    //eacb Expense object inherits a function to calcualte the percentage
    //each function has a specific task
    
    
    Expense.prototype.calculatePercentage = function(totalIncome){
        console.log("inc:" + totalIncome);
        if(totalIncome > 0){
          //  console.log(this.value / totalIncome * 100) ;
            this.percentage = Math.trunc((this.value / totalIncome) * 100) ;

        }
        else{
            this.percentage;
        }
    };
    
    
    Expense.prototype.getPercentage = function(){
        return this.percentage;
    }
    
    
    
    //Income function constructor
        
    var Income = function(id,description,value){
        
        this.id = id;
        this.description = description;
        this.value = value;
        
        
    };
    
    
    var totalExpenses =0;
    
    var calculateAndUpdateTotal = function(type){
    
        var sum = 0;
        data.allItems[type].forEach(function(curr){
            //object has id,desc, and value
            sum+=curr.value;
        });
        
        data.total[type] = sum;
        
    };
    
    
    
    
    var data = {
        allItems:  {
            exp:  new Array(), 
            inc:  new Array()
        }, 
        
    
        total:  {
            exp: 0,
            inc: 0
        },
        
        remainingBudget: 0,
        
        percentage:-1
    };
    
    
    
    //return an object
    //uses closures, inner function has acess to the outer function.
    return {
                        
        addItem: function(type,desc,value){
        var newItem, id;

        //new id
        if(data.allItems[type].length >0){
            //id = last element id + 1
            id = data.allItems[type][data.allItems[type].length - 1].id + 1;
        }
        else{
            id = 0;
        }
    
        //create new item 
        if(type === 'inc'){
            newItem = new Income(id,desc,value);
        }   
        else{
            newItem = new Expense(id,desc,value);
        }
    
        //push into the data structure
        data.allItems[type].push(newItem);
    
        //return new element
        return newItem;
        
        },
        
        
        calculatePercentages: function(){
            //loop through the expense array and calculate its ration: exp/income
            
            //want to retireve a property from each object so use map, whcih returns a new array
            var percentageArray = data.allItems.exp.map(function(curr){
                return curr.calculatePercentage(data.total.inc);
            });
            
            return percentageArray;
            
        },
        
        
        getPercentages: function(){
            
            var percentageArr = new Array();
            data.allItems.exp.forEach(function(curr){
                percentageArr.push(curr.percentage);
                
            });
            return percentageArr;
            
        },
    
        
        testing: function(){
            console.log(data);
        }, 
        
        calculateBudget : function(){
            
            //calculate total income and budget
            calculateAndUpdateTotal('inc');
            calculateAndUpdateTotal('exp');
            //calculate remaining budget, total income - total expenses
            data.remainingBudget = data.total.inc - data.total.exp;
    
            //calculate percentage of income that is spent
            if(data.total.inc > 0){
                data.percentage = Math.round((data.total.exp / data.total.inc) * 100);
            }
            else{
                data.percentage = -1;
            }
        
        
    },
        
        
        
        deleteItem: function(type, id){
            
            console.log(type);
            console.log(id);
            var index, idArray;
            //loop through the type and find the id
            //map returns a new array
            idArray = data.allItems[type].map(function(current){
                
                return current.id;
                
            });
            
            console.log(idArray);
            index = idArray.indexOf(id);
            console.log(index);
            if(index !== -1){
                //splice is to remove elements, mutates the same array
                //1st arg: starting position to delete from
                //2nd arg: number of elements to remove
                data.allItems[type].splice(index, 1);
            }
            

            
        },
        
        
        getBudget: function(){

        return {
            remainingBudget: data.remainingBudget,
            percentage: data.percentage,
            totalIncome: data.total.inc,
            totalExpense: data.total.exp
            
        }
    },
        
     
    }
    
    
})();









//these two controllers are independent/ stand-alone.
//get information/data from the UI
var UIcontroller = (function(){
    
    var DOMstrings = {
        
        inputType: ".add__type", 
        inputDesc: ".add__description", 
        inputVal: ".add__value",
        inputButton: ".add__btn",
        incomeContainer:".income__list", 
        expenseContainer:".expenses__list",
        availableBudget: ".budget__value",
        incomeValue: ".budget__income--value",
        expenseValue: ".budget__expenses--value",
        pertcentage: ".budget__expenses--percentage",
        container: ".container",
        expensePercentage: ".item__percentage",
        month: ".budget__title--month"
        
    };
    
    
     
        var formatNumber =  function(number, type){
            
            //prepend + - depending on type
            
            //2 decimal places and commas, 123,987.321 => 123,987.32
            var sign, decimal;
            number = Math.abs(number);
            //fix to 2 d.p, Number prototype not Math function
            //number is a primitive type but when a method is called, it is converted to an Object and then the
            //methods can be used.
            number = number.toFixed(2);
            
            var numSplit = number.split('.');
            var integer = numSplit[0];
            
            if(integer.length > 3){
                //need to add a comma
                //substring(startPosition, #of elements to read)
                integer = integer.substr(0,integer.length - 3) + ',' + integer.substr(integer.length - 3,3);
                
            }
            
            
            decimal = numSplit[1];
            
            
            return (type === 'exp' ? sign = '-': sign = '+') + '' + integer + '.' +  decimal;
        };
    
    
    
        var nodeListForEach = function(list, callBack){
                
                for(var i=0;i<list.length; i++){
                    //for each iteration, perfrom the callBack funciton, the first arg is curr,
                    //the second arg is the index
                    callBack(list[i], i);
                    
                }
                    
            };
    
        var randomColorGenerator = function () { 
            return '#' + (Math.random().toString(16) + '0000000').slice(2, 8); 
        };
    
    return{
        
        
        getInput: function(){
            return{
                type: document.querySelector(DOMstrings.inputType).value,
                desc: document.querySelector(DOMstrings.inputDesc).value,
                value: parseFloat(document.querySelector(DOMstrings.inputVal).value)
            }
        }, 
        
        
         //CREATE HTML string for placeholder
           addListItem: function(dataObject, type){
           
           var HTML, changedHTML, element;
           
           if(type === 'inc'){
               
           element = DOMstrings.incomeContainer;
           //create HTML string with placeholder text
            HTML = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
           }
           
           else if(type === 'exp'){
           
           element = DOMstrings.expenseContainer;
           HTML = '  <div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
           }
           
           
           
           //replace the placeholder text with the actual data
           changedHTML = HTML.replace('%id%',dataObject.id );
           changedHTML = changedHTML.replace('%description%', dataObject.description);
           changedHTML = changedHTML.replace('%value%', formatNumber(dataObject.value, type) ) ;
           
           //insert the HTML into the DOM
           
           document.querySelector(element).insertAdjacentHTML('beforeend',changedHTML);
               
               
               
               
       },
        
        //update the UI with the new budget
        updateBudget: function(budget){
            var type;
            budget.remainingBudget > 0 ? type = 'inc' : type = 'exp';
            
            
            document.querySelector(DOMstrings.availableBudget).textContent =    formatNumber(budget.remainingBudget, type);
            
            document.querySelector(DOMstrings.incomeValue).textContent = formatNumber(budget.totalIncome,'+');
            document.querySelector(DOMstrings.expenseValue).textContent = formatNumber(budget.totalExpense, '-');

            if(budget.percentage > 0){
                document.querySelector(DOMstrings.pertcentage).textContent = budget.percentage + "%";

            }
            else{
                document.querySelector(DOMstrings.pertcentage).textContent = "%";

            }
            
            
            
        },
        
        
        displayPercentage: function(percentageArray){
            
            //get all of the nodes that have the percentage class
            var percNodeList = document.querySelectorAll(DOMstrings.expensePercentage);
            
            //nodeList does not have the forEach method
            
            
            
            //the function is a callback function. ie will be later called by the nodeListForEach function.
            
            nodeListForEach(percNodeList, function(curr,index){
                
                if(percentageArray[index] > 0){
                    curr.textContent = percentageArray[index] + "%";
                }
                else{
                    curr.textContent = "%";

                }
                
            });

            
        },
        
        
        
        displayChart: function(){
            
            var ctx = document.getElementById('myChart').getContext('2d');
            var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'pie',
            width: 300, 
            height: 300,
        
            // The data for our dataset
            data: {
            labels: ["January", "February", "March", "April", "May", "June", "July"],
            datasets: [{
                fillColor: randomColorGenerator(), 
                strokeColor: randomColorGenerator(), 
                highlightFill: randomColorGenerator(),
                highlightStroke: randomColorGenerator(),
                backgroundColor: randomColorGenerator(),
            //   backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgb(255, 99, 132)',
            data: [0, 10, 5, 2, 20, 30, 45],
            }]
            },

            // Configuration options go here
             options: {
                responsive: false,
                legend: {
                    display: false
                },
                    layout: {
                padding: {
                    left: 50,
                    right: 0,
                    top: 50,
                    bottom: 0
                }
        }
            }
            });
        },
        
        
        deleteListItem: function(elementID){
                
            //traverse the DOM and find the element and remove the element from the type-container
            var el = document.getElementById(elementID);
            el.parentNode.removeChild(el);
        },
        
        
        
        getDOMstrings: function(){
            return DOMstrings;
        },
        
        
        
        displayDate: function(){
            
            
            var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", "January"];
            //will return date of today
            var date = new Date();
            var year = date.getFullYear();
            //month is 0-based
            var monthIx = date.getMonth();
            
            var day = date.getDay();
            
            document.querySelector(DOMstrings.month).textContent = months[monthIx] + " " + year;
            
        },
        
        
        changeType: function(){
            
            var fields = document.querySelectorAll(DOMstrings.inputType + ',' +
                                                   DOMstrings.inputDesc + ',' + 
                                                   DOMstrings.inputVal);
            
            
            nodeListForEach(fields,function(curr){
                //toggle the focus element 
                curr.classList.toggle('red-focus');
            });
            
            document.querySelector(DOMstrings.inputButton).classList.toggle('red');
            
        },
        
        
        
        clearInputFields: function(){
            var fields, arr;
            //returns a list
            fields = document.querySelectorAll(DOMstrings.inputDesc + "," + DOMstrings.inputVal);
            //all arrays inherit the slice method, can trick the method by passing a list which returns an array
            arr = Array.prototype.slice.call(fields);
            
            //current elem, index of curr elem, whole array
            arr.forEach(function(curr, index, array){
                curr.value = "";
            });
            
            arr[0].focus();
            
        },
        
    
    }

    
    
})();


    



//GLOBAL APP CONTROLLER
//main controller, delegate tasks to other controllers.
//control center, gets data and tells other module to store data
var controller = (function(budgetCntrl, UIcntrl){
    
    
    var setEventListeners = function(){
        
        
        var DOM = UIcntrl.getDOMstrings();
        
        document.querySelector(DOM.inputButton).addEventListener("click", addItem);

    
        //check for return key
        //happens on the global page
        //the event gets automatically passed into function
        document.addEventListener("keypress", function(event){

            if(event.keyCode == 13 || event.which == 13){
                addItem();
            }

        });
        
        
        document.querySelector(DOM.container).addEventListener("click", deleteItem );
        
        
        //changing UX when type is changed
        document.querySelector(DOM.inputType).addEventListener('change',UIcntrl.changeType);
            
        
    }
    
    
    
    var updateBudget = function(){
        
        //1.calculate budget
        budgetCntrl.calculateBudget();
        //2.return budget  
        var budget = budgetCntrl.getBudget();
        console.log(budget);
        //3.display the budget on the UI
        UIcntrl.updateBudget(budget);
        
        
    }
    
    
    var addItem = function(){
        
        var input, newItem;
        
        //1.get the input data
        input = UIcntrl.getInput();
       
        console.log(input);
        
        if(input.desc !== "" && !isNaN(input.value) && input.value > 0){
            
           //2.add to the budge controller
           newItem = budgetCntrl.addItem(input.type, input.desc, input.value);
           //3.add the item to the new UI
           UIcntrl.addListItem(newItem,input.type);

           //4. Clear fields
            UIcntrl.clearInputFields();

            //5. calculate and update budget
            updateBudget();
            
            
            //6. calculate and update the expense percentages
            updatePercentages();
            
            
        }
    
        
    
        
    };
    
    
    
    var deleteItem = function(event){
        //want to know the target element(event delegation)
        var elemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        var splitElem,type,id;
        if(elemId){
            //format: inc-10/ exp-0
            splitElem = elemId.split('-');
            type = splitElem[0];
            id = splitElem[1];
            
            console.log(type);
            console.log(id);
            //delete item form Data structure
            budgetCntrl.deleteItem(type,parseInt(id));
            
            //remove item from UI
            UIcntrl.deleteListItem(elemId);
            //update budget
            updateBudget();
            
        }

        
        
    };
        
    var updatePercentages = function(){
        
        //1. Calculate all of the percentages of expenses from budget controller
        
        budgetCntrl.calculatePercentages();
        
        //2. Read the percentages of expenses
        var percArray = budgetCntrl.getPercentages();
        
        
        //3. Update the UI with the new expense percentages
        console.log(percArray);
        UIcntrl.displayPercentage(percArray);
    };    
    
    
  //public initialization function
    return{
        init: function(){
            console.log("application has started");
            UIcntrl.updateBudget(budgetCntrl.getBudget());
            UIcntrl.displayDate();
           // UIcntrl.displayChart();
            setEventListeners();
            
        }
    };
    
    
})(budgetController, UIcontroller);


controller.init();
