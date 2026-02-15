
# Finance Donation Module API Specification

Base URL: `/api/v1`

## Authentication
All endpoints require a Bearer Token in the Authorization header.
Header: `Authorization: Bearer <access_token>`

---

## 1. Create Donation
Creates a new donation record. Handles both Money and Goods donations.
*   **Endpoint**: `POST /finance/donations`
*   **Content-Type**: `multipart/form-data`
*   **Permission**: `finance_donations.create`

### Request Parameters (Form-Data)

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `donor_name` | string | Yes | Name of the donor. |
| `donor_phone` | string | No | Phone number. Used to find existing donor. |
| `donor_email` | string | No | Email address. |
| `donor_address` | string | No | Physical address. |
| `type` | string | Yes | `MONEY`, `GOODS`, or `MIXED`. |
| `payment_method` | string | Yes | `CASH`, `TRANSFER`, `QRIS`, or `GOODS`. |
| `total_amount` | number | No | Total monetary value. Required if type is MONEY. |
| `description` | string | No | Optional notes (e.g., "Shodaqah Jumat"). |
| `proof_file` | file | No | Image/PDF proof of transaction. |
| `items_json` | string | No | JSON string array for goods items. |

**Structure of `items_json` (Array of Objects):**
```json
[
  {
    "item_name": "Rice",
    "quantity": 10,
    "unit": "kg",
    "estimated_value": 150000,
    "notes": "Premium Quality"
  }
]
```

### Response (Success 200)
```json
{
  "status": "success",
  "message": "Donation created successfully",
  "data": {
    "id": "uuid",
    "date": "2023-10-27T10:00:00Z",
    "type": "MONEY",
    "payment_method": "CASH",
    "total_amount": 500000,
    "description": "Shodaqah",
    "proof_file": "uploads/donations/file.jpg",
    "donor": {
      "id": "uuid",
      "name": "Budi",
      "phone": "08123456789"
    },
    "employee": {
      "id": "uuid",
      "name": "Staff Name"
    },
    "items": [],
    "created_at": "..."
  }
}
```

---

## 2. Get Donations List
Retrieve a paginated list of donations.
*   **Endpoint**: `GET /finance/donations`
*   **Permission**: `finance_donations.read`

### Query Parameters

| Field | Type | Description |
| :--- | :--- | :--- |
| `limit` | int | Number of records per page (default: 10). |
| `offset` | int | Number of records to skip (default: 0). |
| `type` | string | Filter by donation type (`MONEY`, `GOODS`). |
| `donor_id` | string | Filter by specific donor ID. |
| `date_from` | string | Filter start date (YYYY-MM-DD). |
| `date_to` | string | Filter end date (YYYY-MM-DD). |

### Response (Success 200)
```json
{
  "status": "success",
  "message": "Donations retrieved successfully",
  "data": {
    "items": [
      {
        "id": "uuid",
        "date": "...",
        "type": "MONEY",
        "total_amount": 500000,
        "donor": { ... },
        "employee": {
          "id": "uuid",
          "name": "Staff Name"
        }
      }
    ],
    "total": 100,
    "limit": 10,
    "offset": 0
  }
}
```

---

## 3. Get Donors List
Retrieve a paginated list of donors.
*   **Endpoint**: `GET /finance/donors`
*   **Permission**: `finance_donors.read`

### Query Parameters

| Field | Type | Description |
| :--- | :--- | :--- |
| `limit` | int | Number of records per page (default: 10). |
| `offset` | int | Number of records to skip (default: 0). |
| `name` | string | Search donors by name (partial match). |

### Response (Success 200)
```json
{
  "status": "success",
  "message": "Donors retrieved successfully",
  "data": {
    "items": [
      {
        "id": "uuid",
        "name": "Budi",
        "phone": "08123456789",
        "email": "budi@example.com",
        "address": "Jakarta"
      }
    ],
    "total": 50,
    "limit": 10,
    "offset": 0
  }
}
```
