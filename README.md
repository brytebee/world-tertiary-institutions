# University API Documentation

## Overview

The University API provides access to a comprehensive list of universities worldwide. Users can search for universities by name, state/province, and country. Additionally, the API supports pagination to handle large sets of data efficiently.

## Base URL

```

http://localhost:3000/api/universities

```

## Endpoints

### GET /api/universities

Retrieve a list of universities based on query parameters.

#### Query Parameters

- `name` (optional): The name of the university to search for. This parameter supports partial matches.
- `state` (optional): The state or province of the university. This parameter supports partial matches.
- `country` (optional): The country where the university is located. This parameter requires an exact match.
- `page` (optional): The page number for pagination. Default is `1`.
- `limit` (optional): The number of results per page. Default is `10`. The maximum is `20`.

#### Example Request

```sh
GET /api/universities?name=Sabanci&page=1&limit=10
```

#### Example Response

```json
{
  "total": 1,
  "page": 1,
  "limit": 10,
  "universities": [
    {
      "alpha_two_code": "TR",
      "country": "Turkey",
      "state-province": null,
      "domains": ["sabanciuniv.edu", "sabanciuniv.edu.tr"],
      "name": "Sabanci University",
      "web_pages": [
        "http://www.sabanciuniv.edu/",
        "http://www.sabanciuniv.edu.tr/"
      ]
    }
  ]
}
```

#### Response Fields

- `total`: The total number of universities that match the search criteria.
- `page`: The current page number.
- `limit`: The number of universities returned per page.
- `universities`: An array of university objects.

Each university object contains the following fields:

- `alpha_two_code`: The two-letter country code of the university.
- `country`: The country where the university is located.
- `state-province`: The state or province where the university is located (if available).
- `domains`: An array of domain names associated with the university.
- `name`: The name of the university.
- `web_pages`: An array of URLs to the university's web pages.

## Error Handling

The API returns appropriate HTTP status codes and error messages for various error conditions.

### 404 Not Found

Returned when no universities match the search criteria.

#### Example Response

```json
{
  "error": "No universities found"
}
```

## Pagination

The API supports pagination to manage large sets of data. Use the `page` and `limit` query parameters to navigate through the results.

- `page`: The page number to retrieve. Default is `1`.
- `limit`: The number of results per page. Default is `10`. The maximum is `20`.

## Data Source

The university data is sourced from the [Hipo University Domains List](https://github.com/Hipo/university-domains-list).

## Example Usage

### Search by University Name

```sh
GET /api/universities?name=Harvard
```

### Search by Country

```sh
GET /api/universities?country=United States
```

### Search by State/Province

```sh
GET /api/universities?state=California
```

### Combined Search

Search by name, state/province, and country to narrow down the results.

```sh
GET /api/universities?name=University&state=California&country=United States
```

### Pagination Example

Retrieve the second page of results with 10 universities per page.

```sh
GET /api/universities?page=2&limit=10
```

## Limitations

- The `limit` query parameter cannot exceed 20. If a higher limit is provided, the API will automatically set the limit to 20.
- The `state-province` field may be `null` for universities that do not have a state or province listed in the data source.

## Example Error Responses

### No Universities Found

If no universities match the search criteria, the API will return a `404 Not Found` status with an appropriate error message.

#### Example Response

```json
{
  "error": "No universities found"
}
```

### Invalid Query Parameters

If the query parameters are invalid or missing required information, the API will return a `400 Bad Request` status with an appropriate error message.

#### Example Response

```json
{
  "error": "Invalid query parameters"
}
```

## Conclusion

This API provides a flexible and efficient way to search for universities by name, state/province, and country, with support for pagination. For further information or to contribute to the data source, please refer to the [Hipo University Domains List](https://github.com/Hipo/university-domains-list) repository.

---

Feel free to reach out if you have any questions or need further assistance with the University API.
