// Client-side script for portfolio page

const addStockPortfolioButton = document.querySelector('.add-stock-portfolio-button');
const addStockWatchlistButton = document.querySelector('.add-stock-watchlist-button');

addStockPortfolioButton.addEventListener('click', (e) => {

    // Create Dynamic Form 
    let parentSection = addStockPortfolioButton.parentElement;
    let form = document.createElement('form');
    form.setAttribute('action', '/addStockToPortfolio');
    form.setAttribute('method', 'post');

    // Create ticker input
    let div = document.createElement('div');
    let label = document.createElement('label');
    label.setAttribute('for', 'ticker')
    label.textContent = 'Stock Ticker: ';
    let input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('name', 'ticker');
    input.setAttribute('id', 'ticker');
    div.appendChild(label);
    div.appendChild(input);

    // Add ticket input to form 
    form.appendChild(div);

    // Create quantity input
    let div2 = document.createElement('div');
    let label2 = document.createElement('label');
    label2.setAttribute('for', 'qty')
    label2.textContent = 'Enter Quantity: ';
    let input2 = document.createElement('input');
    input2.setAttribute('type', 'number');
    input2.setAttribute('name', 'qty');
    input2.setAttribute('id', 'qty');
    input2.setAttribute('min', 1)
    div2.appendChild(label2);
    div2.appendChild(input2);

    // Add quantity input to form 
    form.appendChild(div2)

    // Create Cancel Button 
    let cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    form.appendChild(cancelBtn);

    // Create Add to Portfolio+ Button
    let addBtn = document.createElement('button');
    addBtn.textContent = 'Add to Portfolio +';
    addBtn.setAttribute('type', 'submit');
    addBtn.setAttribute('value', 'submit');
    form.appendChild(addBtn)

    // Append to Section
    parentSection.appendChild(form)


})

addStockWatchlistButton.addEventListener('click', (e) => {

    // Create Dynamic Form 
    let parentSection = addStockWatchlistButton.parentElement;
    let form = document.createElement('form');
    form.setAttribute('action', '/addStockToWatchlist');
    form.setAttribute('method', 'post');

    // Create ticker input
    let div = document.createElement('div');
    let label = document.createElement('label');
    label.setAttribute('for', 'ticker')
    label.textContent = 'Stock Ticker: ';
    let input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('name', 'ticker');
    input.setAttribute('id', 'ticker');
    div.appendChild(label);
    div.appendChild(input);

    // Add ticket input to form 
    form.appendChild(div);

    /* 
// Create quantity input
let div2 = document.createElement('div');
let label2 = document.createElement('label');
label2.setAttribute('for', 'qty')
label2.textContent = 'Enter Quantity: ';
let input2 = document.createElement('input');
input2.setAttribute('type', 'number');
input2.setAttribute('name', 'qty');
input2.setAttribute('id', 'qty');
input2.setAttribute('min', 1)
div2.appendChild(label2);
div2.appendChild(input2);

// Add quantity input to form 
form.appendChild(div2)
*/

    // Create Cancel Button 
    let cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    form.appendChild(cancelBtn);

    // Create Add to Portfolio+ Button
    let addBtn = document.createElement('button');
    addBtn.textContent = 'Add to Watch List +';
    addBtn.setAttribute('type', 'submit');
    addBtn.setAttribute('value', 'submit');
    form.appendChild(addBtn)

    // Append to Section
    parentSection.appendChild(form)


})

let deletePortfolioBtn = document.querySelectorAll('.delete-stock-from-portfolio');

for (let btn of deletePortfolioBtn) {

    btn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            let prevElement = btn.parentElement.previousElementSibling.previousElementSibling;
            let stockTicker = prevElement.textContent;

            let response = await fetch('/deleteStockFromPortfolio', {
                method: "DELETE",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ ticker: stockTicker })
            })
            if (response.status == 200) {
                let parentDiv = prevElement.parentElement;
                parentDiv.remove();
            }
            else {
                console.log("Error with removing element")
            }
        }
        catch (err) {
            console.log("Error deleting stock from portfolio", err)
        }
    })
}

let deleteWatchlistBtn = document.querySelectorAll('.delete-stock-from-watchlist');

for (let btn of deleteWatchlistBtn) {

    btn.addEventListener('click', async (e) => {
        e.preventDefault();
        try {
            let prevElement = btn.parentElement.previousElementSibling;
            let stockTicker = prevElement.textContent;

            let response = await fetch('/deleteStockFromWatchlist', {
                method: "DELETE",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ ticker: stockTicker })
            })
            if (response.status == 200) {
                let parentDiv = prevElement.parentElement;
                parentDiv.remove();
            }
            else {
                console.log("Error with removing element")
            }
        }
        catch (err) {
            console.log("Error deleting stock from portfolio", err)
        }
    })
}


