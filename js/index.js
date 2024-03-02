import {
  listStockStats,
  selectCompany,
  updateStockStats,
  updateStockProfile,
  updateStockData,
  showStockProfile,
} from './app.js';
getData();

async function getData() {
  try {
    console.log('get data ==>');
    const stocksStatsData = await (
      await fetch('https://stocks3.onrender.com/api/stocks/getstockstatsdata')
    ).json();
    updateStockStats(stocksStatsData);
    listStockStats(stocksStatsData);
    const stocksProfileData = await (
      await fetch(
        'https://stocks3.onrender.com/api/stocks/getstocksprofiledata'
      )
    ).json();
    updateStockProfile(stocksProfileData);
    showStockProfile('AAPL', stocksStatsData, stocksProfileData);
    const stocksData = await (
      await fetch('https://stocks3.onrender.com/api/stocks/getstocksdata')
    ).json();
    updateStockData(stocksData);
    selectCompany('AAPL', '1mo', '1 Month');
  } catch (error) {
    console.log('err', error);
  }
}
