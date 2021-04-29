jQuery(document).ready(chart)


async function getData(){
     const response = await fetch('data/csv/MichiganTop20MarketData.csv')
    const data = await response.text();

    const table = data.split('\n').slice(1);
    table.forEach(elt=> {
        const row = elt.split(',');
        const city = row[0]
        xlabels.push(city);
        const guestArrivals = row[1];
        ynum.push(guestArrivals);
        const medianValue = row[2];
        console.log(city, guestArrivals, medianValue)
    });

}

const xlabels = [];
const ynum = [];


async function chart(){
    await getData();
    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: xlabels,
            datasets: [{
                label: 'Total AirBNB Tax Revenue',
                data: ynum,
                backgroundColor: [
                    'rgba(228, 241, 254, 1)'
                ],
                borderColor: [
                    'rgba(34, 49, 63, 1)'
                ],
                borderWidth: 3
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    }