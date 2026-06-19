function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('Tender Insights')
    .addItem('Generate Insights', 'generateInsights')
    .addToUi();
}

function generateInsights() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const goodsSheet = ss.getSheetByName("GOODS DATA");
  const worksSheet = ss.getSheetByName("WORKS DATA");

  const goodsData = goodsSheet.getDataRange().getValues();
  const worksData = worksSheet.getDataRange().getValues();

  const headers = goodsData[0];
  const contractCol = headers.indexOf("Contract Amount in Cr");
  const authorityCol = headers.indexOf("Awarding Authority");
  const psuCol = headers.indexOf("PSU CATEGORY");
  const awardeeCol = headers.indexOf("Awardee(s)");

  const combinedData = [...goodsData.slice(1), ...worksData.slice(1)];

  generateExecutiveSummary(
    ss, goodsData, worksData, combinedData,
    contractCol, authorityCol, psuCol, awardeeCol
  );

  generateABCReport(
    ss, "ABC ANALYSIS - SECTOR", combinedData,
    contractCol, psuCol, 6, "Sector", true
  );

  generateABCReport(
    ss, "ABC ANALYSIS - GOODS SUPPLIER", goodsData.slice(1),
    contractCol, awardeeCol, 9, "Supplier", false
  );

  generateABCReport(
    ss, "ABC ANALYSIS - WORKS CONTRACTOR", worksData.slice(1),
    contractCol, awardeeCol, 9, "Contractor", false
  );

  SpreadsheetApp.getUi().alert("Insights generated successfully.");
}

function generateExecutiveSummary(ss, goodsData, worksData, combinedData, contractCol, authorityCol, psuCol, awardeeCol) {
  let sheet = ss.getSheetByName("EXECUTIVE_SUMMARY") || ss.insertSheet("EXECUTIVE_SUMMARY");
  sheet.clear();

  let total = 0, authorities = new Set(), sectors = new Set(), awardees = new Set();

  combinedData.forEach(r => {
    total += Number(r[contractCol]) || 0;
    if (r[authorityCol]) authorities.add(r[authorityCol]);
    if (r[psuCol]) sectors.add(r[psuCol]);
    if (r[awardeeCol]) awardees.add(r[awardeeCol]);
  });

  const goodsAmt = goodsData.slice(1).reduce((s,r)=>s+(Number(r[contractCol])||0),0);
  const worksAmt = worksData.slice(1).reduce((s,r)=>s+(Number(r[contractCol])||0),0);

  const goodsPSU = new Set(goodsData.slice(1).map(r=>String(r[authorityCol]).trim()).filter(Boolean));
  const worksPSU = new Set(worksData.slice(1).map(r=>String(r[authorityCol]).trim()).filter(Boolean));

  let goodsOnly=0, worksOnly=0, both=0;
  goodsPSU.forEach(x=> worksPSU.has(x) ? both++ : goodsOnly++);
  worksPSU.forEach(x=> { if(!goodsPSU.has(x)) worksOnly++; });

  let row=1;
  sheet.getRange(row,1).setValue("EXECUTIVE SUMMARY").setFontWeight("bold"); row+=2;

  sheet.getRange(row++,1).setValue("SECTION 1 - EXECUTIVE SUMMARY").setFontWeight("bold");
  sheet.getRange(row,1,5,2).setValues([
    ["Metric","Value"],
    ["TOTAL CONTRACT VALUE (Cr)", Number(total.toFixed(2))],
    ["TENDER SAMPLE SIZE", combinedData.length],
    ["PSU BUYERS AND SECTORS", authorities.size+" PSU Buyers from "+sectors.size+" Sectors"],
    ["AWARDEES", awardees.size]
  ]);
  row += 7;

  sheet.getRange(row++,1).setValue("SECTION 2 - GOODS VS WORKS SPLIT").setFontWeight("bold");
  sheet.getRange(row,1,4,3).setValues([
    ["Metric","Goods","Works"],
    ["Contract Count", goodsData.length-1, worksData.length-1],
    ["Contract Amount (Cr)", Number(goodsAmt.toFixed(2)), Number(worksAmt.toFixed(2))],
    ["Average Contract Amount (Cr)", Number((goodsAmt/(goodsData.length-1)).toFixed(2)), Number((worksAmt/(worksData.length-1)).toFixed(2))]
  ]);
  row += 6;

  sheet.getRange(row++,1).setValue("SECTION 3 - CATEGORIZATION BY PSUs").setFontWeight("bold");
  sheet.getRange(row,1,4,2).setValues([
    ["Category","Count"],
    ["PSUs only in Goods", goodsOnly],
    ["PSUs only in Works", worksOnly],
    ["PSUs in Both", both]
  ]);

  sheet.autoResizeColumns(1,4);
}

function generateABCReport(ss, title, data, contractCol, groupCol, topN, entityLabel, clearSheet) {
  let sheet = ss.getSheetByName("ABC_ANALYSIS") || ss.insertSheet("ABC_ANALYSIS");
  if (clearSheet) sheet.clear();

  let row = sheet.getLastRow() + 1;
  if (row < 1) row = 1;

  const map = {};
  let total = 0;

  data.forEach(r => {
    const key = String(r[groupCol]).trim();
    if (!key || key.toLowerCase() === "not found") return;
    const val = Number(r[contractCol]) || 0;
    total += val;
    map[key] = (map[key] || 0) + val;
  });

  const items = Object.entries(map)
    .map(([k,v])=>({name:k,value:v}))
    .sort((a,b)=>b.value-a.value);

  let cum=0,aC=0,bC=0,cC=0,aV=0,bV=0,cV=0;

  items.forEach(i=>{
    cum += (i.value/total)*100;
    if(cum<=70){aC++;aV+=i.value;}
    else if(cum<=90){bC++;bV+=i.value;}
    else {cC++;cV+=i.value;}
  });

  sheet.getRange(row++,1).setValue(title).setFontWeight("bold");
  row++;

  sheet.getRange(row,1,4,3).setValues([
    ["Category", entityLabel+" Count","Total Value (Cr)"],
    ["A",aC,Number(aV.toFixed(2))],
    ["B",bC,Number(bV.toFixed(2))],
    ["C",cC,Number(cV.toFixed(2))]
  ]);

  row += 6;

  sheet.getRange(row,1,4,2).setValues([
    ["Category","Share %"],
    ["A",Number(((aV/total)*100).toFixed(2))],
    ["B",Number(((bV/total)*100).toFixed(2))],
    ["C",Number(((cV/total)*100).toFixed(2))]
  ]);

  row += 6;

  const top = items.slice(0, topN).map(x=>[x.name, Number(x.value.toFixed(2)), Number(((x.value/total)*100).toFixed(2))]);

  sheet.getRange(row++,1).setValue("TOP "+topN+" "+entityLabel.toUpperCase()+"S").setFontWeight("bold");
  sheet.getRange(row,1,top.length+1,3).setValues([
    [entityLabel,"Total Value (Cr)","Share %"],
    ...top
  ]);

  sheet.autoResizeColumns(1,4);
}
