let stocksStatsData;
let stocksProfileData;
let stocksData;
export function updateStockStats(data) {
  stocksStatsData = data;
}
export function updateStockProfile(data) {
  stocksProfileData = data;
}
export function updateStockData(data) {
  stocksData = data;
}

// Update the following functions to return the values
export function getStocksStatsData() {
  return stocksStatsData;
}

export function getStocksProfileData() {
  return stocksProfileData;
}

export function getStocksData() {
  return stocksData;
}

// Rest of your functions...

export function addClass(e, ...classes) {
  for (var i = 0; i < classes.length; i++) {
    e.classList.add(classes[i]);
  }
}
export function removeClass(e, ...classes) {
  for (var i = 0; i < classes.length; i++) {
    e.classList.remove(classes[i]);
  }
}
export function listStockStats(stocksStatsData) {
  const summaryList = document.querySelector('.summary-list');
  for (const company in stocksStatsData.stocksStatsData[0]) {
    const { bookValue, profit } = stocksStatsData.stocksStatsData[0][company];
    console.log(bookValue, profit);
    if (!bookValue) {
      continue;
    }
    // console.log(company, bookValue, profit);
    const li = document.createElement('li');
    addClass(li, 'summary-item', 'flex');
    const companyNameSpan = document.createElement('span');
    const companyName = document.createElement('button');
    addClass(companyName, 'company-name', 'text-uppercase');
    companyName.textContent = company;
    const sharePrice = document.createElement('span');
    addClass(sharePrice, 'share-price');
    sharePrice.textContent = '$' + bookValue;
    const shareGrowth = document.createElement('span');
    addClass(shareGrowth, 'share-growth');
    shareGrowth.textContent = profit.toFixed(2) + '%';
    companyNameSpan.append(companyName);
    li.append(companyNameSpan, sharePrice, shareGrowth);
    companyName.addEventListener('click', function (e) {
      selectCompany(e.target.innerHTML, '1mo', '1 Month');
    });
    summaryList.appendChild(li);

    // <li class="summary-item flex">
    //           <span class="comapny-name text-uppercase">aapl</span>
    //           <span class="share-price">$3.953</span>
    //           <span class="share-growth">0.24%</span>
    //         </li>
  }
}
export function showStockProfile(company, stocksStatsData, stocksProfileData) {
  console.log(company, stocksStatsData, stocksProfileData);

  const { bookValue, profit } = stocksStatsData.stocksStatsData[0][company];
  const details = stocksProfileData.stocksProfileData[0][company].summary;
  const companyName = document.createElement('span');
  addClass(companyName, 'company-name', 'text-uppercase');
  companyName.textContent = company;
  const sharePrice = document.createElement('span');
  addClass(sharePrice, 'share-price');
  sharePrice.textContent = '$' + bookValue;
  const shareGrowth = document.createElement('span');
  addClass(shareGrowth, 'share-growth');
  shareGrowth.textContent = profit + '%';
  const summaryHeading = document.querySelector('.summary-heading');
  summaryHeading.innerHTML = '';
  summaryHeading.append(companyName, shareGrowth, sharePrice);
  document.querySelector('#company-details').innerHTML = details;
}
function externalTooltipHandler(context) {
  const { chart, tooltip } = context;

  // Hide if no tooltip
  if (tooltip.opacity === 0) {
    // Clear previous content including priceNode and timeNode
    const tooltipEl = chart.canvas.parentNode.querySelector('.custom-tooltip');
    if (tooltipEl) {
      tooltipEl.innerHTML = '';
    }
    return;
  }

  // Additional Information
  const price = tooltip.dataPoints[0].parsed.y.toFixed(2);
  const time = tooltip.dataPoints[0].label;

  // Create or update the vertical line
  let line = chart.canvas.parentNode.querySelector('.custom-tooltip-line');
  if (!line) {
    line = document.createElement('div');
    line.classList.add('custom-tooltip-line');
    line.style.width = '2px';
    line.style.height = '88%'; // Adjust height as needed
    line.style.background = 'white';
    line.style.position = 'absolute';
    chart.canvas.parentNode.appendChild(line);
  }

  // Position the line based on the tooltip caret position
  line.style.left = tooltip.caretX + 'px';
  line.style.bottom = '7%'; // Adjust bottom spacing as needed
  line.style.transform = 'translate(-50%, 0)';

  // Add price and time information
  let priceNode = chart.canvas.parentNode.querySelector('.price-node');
  let timeNode = chart.canvas.parentNode.querySelector('.time-node');

  if (!priceNode) {
    priceNode = document.createElement('div');
    priceNode.classList.add('price-node');
    priceNode.style.color = 'white';
    priceNode.style.position = 'absolute';
    chart.canvas.parentNode.appendChild(priceNode);
  }

  if (!timeNode) {
    timeNode = document.createElement('div');
    timeNode.classList.add('time-node');
    timeNode.style.color = 'white';
    timeNode.style.position = 'absolute';
    chart.canvas.parentNode.appendChild(timeNode);
  }

  // // Position the priceNode above the line
  // priceNode.textContent = `AAPL: $${price}`;
  // priceNode.style.bottom = 'calc(100%)'; // Positioned above the line
  // priceNode.style.left = tooltip.caretX - priceNode.offsetWidth / 2 + 'px';

  priceNode.textContent = `AAPL: $${price}`;
  priceNode.style.top = tooltip.caretY - 25 + 'px'; // Adjust as needed
  priceNode.style.left = tooltip.caretX + 10 + 'px';

  // Position the timeNode below the line
  timeNode.textContent = time;
  timeNode.style.top = 'calc(100% - 5%)'; // Adjust top spacing as needed
  timeNode.style.left = tooltip.caretX - timeNode.offsetWidth / 2 + 'px';
}
export function createChart(timeStamp, sharePrices, label) {
  const existingChart = Chart.getChart('myChart');

  // If a chart with the same ID exists, destroy it
  if (existingChart) {
    existingChart.destroy();
  }
  const labels = timeStamp.map((e) => {
    return new Date(e * 1000).toLocaleDateString();
  });

  const data = {
    labels: labels,
    datasets: [
      {
        data: sharePrices,
        borderColor: 'green',
        fill: false,
        label,
      },
    ],
  };

  const config = {
    type: 'line',
    data,
    options: {
      plugins: {
        tooltip: {
          enabled: false, // Enable the tooltip
          position: 'nearest',
          external: externalTooltipHandler,
        },
      },
      scales: {
        x: {
          display: false,
        },
        y: {
          display: false,
        },
      },
    },
  };

  new Chart('myChart', config);
}

export function selectCompany(company, duration, label) {
  const data = stocksData.stocksData[0][company][duration];
  createChart(data.timeStamp, data.value, label);
  const companyName = document.querySelector(
    '.summary-heading .company-name'
  ).innerHTML;
  if (companyName === company) {
    return;
  }
  showStockProfile(company, stocksStatsData, stocksProfileData);
}
const durationButtons = document.querySelectorAll('.btn_group-duration button');
durationButtons.forEach((btn) => {
  btn.addEventListener('click', function (e) {
    if (e.target.classList.contains('active')) {
      return;
    }
    durationButtons.forEach((el) => {
      el.classList.remove('active');
    });
    e.target.classList.add('active');
    let duration;
    let label;
    if (e.target.classList.contains('btn_month-1')) {
      duration = '1mo';
      label = '1 Month';
    } else if (e.target.classList.contains('btn_month-3')) {
      duration = '3mo';
      label = '3 Month';
    } else if (e.target.classList.contains('btn_year-1')) {
      duration = '1y';
      label = '1 Year';
    } else {
      duration = '5y';
      label = '5 Year';
    }
    const companyName = document.querySelector(
      '.summary-heading .company-name'
    ).innerHTML;
    const data = stocksData.stocksData[0][companyName][duration];
    createChart(data.timeStamp, data.value, label);
  });
});
