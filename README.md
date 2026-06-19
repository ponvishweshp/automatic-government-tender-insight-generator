# Tender Insight Generator

<p align="center">
  <h3 align="center">Procurement Intelligence Automation using Google Apps Script</h3>
  <p align="center">
    Automated Executive Summaries and Pareto-Based ABC Analysis for Government Tender Datasets
  </p>
</p>

---

## Overview

Tender Insight Generator is a Google Apps Script–based procurement analytics engine designed to automate insight generation from government tender datasets.

The application consolidates **Goods** and **Works** procurement records, performs Pareto-based ABC analysis, and produces management-ready reports directly within Google Sheets.

Users simply paste tender data into predefined worksheets and generate procurement insights with a single click.

---

## Features

### Executive Summary

Generates key procurement indicators from Goods and Works datasets.

Metrics generated include:

* Total Contract Value (Cr)
* Tender Sample Size
* Number of PSU Buyers
* Number of PSU Sectors
* Number of Unique Awardees

---

### Goods vs Works Split

Compares procurement trends between Goods and Works contracts.

Metrics generated include:

* Goods Contract Count
* Works Contract Count
* Goods Contract Value
* Works Contract Value
* Average Goods Contract Size
* Average Works Contract Size

---

### PSU Categorization Analysis

Identifies procurement authorities based on their participation across datasets.

Metrics generated include:

* PSUs appearing only in Goods Procurement
* PSUs appearing only in Works Procurement
* PSUs appearing in both datasets

---

# ABC Analysis

The application performs Pareto-based ABC Analysis using cumulative contract value contribution.

## Classification Logic

| Category | Cumulative Contribution |
| -------- | ----------------------- |
| A        | ≤ 70%                   |
| B        | 70% – 90%               |
| C        | > 90%                   |

---

## ABC Analysis – Sector

### Dataset Used

```text
GOODS DATA
+
WORKS DATA
```

### Grouping Variable

```text
PSU CATEGORY
```

### Outputs Generated

* Number of sectors in Category A, B and C
* Contract value contribution of Category A, B and C
* Percentage share of Category A, B and C
* Top 6 sectors by contract value

---

## ABC Analysis – Goods Suppliers

### Dataset Used

```text
GOODS DATA
```

### Grouping Variable

```text
Awardee(s)
```

### Outputs Generated

* Number of suppliers in Category A, B and C
* Contract value contribution of Category A, B and C
* Percentage share of Category A, B and C
* Top 9 suppliers by contract value

---

## ABC Analysis – Works Contractors

### Dataset Used

```text
WORKS DATA
```

### Grouping Variable

```text
Awardee(s)
```

### Outputs Generated

* Number of contractors in Category A, B and C
* Contract value contribution of Category A, B and C
* Percentage share of Category A, B and C
* Top 9 contractors by contract value

---

# Project Workflow

```text
                GOODS DATA
                     │
                     │
                     ▼

          ┌────────────────────┐
          │                    │
          │  ANALYTICS ENGINE  │
          │                    │
          └────────────────────┘
                     ▲
                     │
                     │

                WORKS DATA



        ┌────────────────────┐
        │ EXECUTIVE SUMMARY  │
        └────────────────────┘


        ┌────────────────────┐
        │    ABC ANALYSIS    │
        └────────────────────┘
```

---

# Technologies Used

* Google Apps Script
* Google Sheets
* JavaScript
* Pareto Analysis
* Procurement Analytics
* ETL Concepts
* Business Intelligence

---

# Repository Structure

```text
Tender-Insight-Generator/

│── Code.gs

│── README.md


│── screenshots/

│     executive_summary.png

│     abc_analysis.png


│── docs/

│     methodology.md
```

---

# Installation

### Step 1

Open Google Sheets

### Step 2

Navigate to

```text
Extensions
```

↓

```text
Apps Script
```

### Step 3

Copy the contents of **Code.gs**

### Step 4

Save the script

### Step 5

Refresh the spreadsheet

### Step 6

Click

```text
Tender Insights
```

↓

```text
Generate Insights
```

The application automatically generates:

* `EXECUTIVE_SUMMARY`
* `ABC_ANALYSIS`

---

# Screenshots

### Executive Summary

![Executive Summary](screenshots/executive_summary.png)

---

### ABC Analysis

![ABC Analysis](screenshots/abc_analysis.png)

---

# Future Enhancements

Planned improvements include:

* Automatic preprocessing of contract values expressed in Lac and Crore formats
* Interactive charts within Google Sheets
* PDF export of procurement reports
* Supplier concentration metrics
* Tender keyword intelligence

---

# Author

### Ponvishwesh

MBA – Business Analytics
