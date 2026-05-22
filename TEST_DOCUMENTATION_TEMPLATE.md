# Test Documentation Template

## Short Summary

- Tester:
- Date:
- Environment:
- Browser/device coverage:
- Build or commit:
- Overall result:

## Test Cases

| ID | Area | Scenario | Preconditions | Steps | Expected Result | Actual Result | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| UI-001 | Sign In | Valid applicant login | App is open at `http://localhost:5173` | Enter valid email and password, submit | Dashboard is visible |  |  |  |
| UI-002 | Sign In | Empty email validation | App is open on sign-in page | Submit empty form | `Email is required.` is shown |  |  |  |
| UI-003 | Projects | Create custom project | Applicant is signed in | Open Projects, create project, submit valid data | Project appears in list |  |  |  |
| API-001 | API | Positive API case | API is available | Send request | Expected status/body returned |  |  |  |
| API-002 | API | Negative API case | API is available | Send invalid request | Expected error behavior returned |  |  |  |

## Possible Bugs

| Bug ID | Title | Severity | Area | Status |
| --- | --- | --- | --- | --- |
| BUG-001 |  |  |  |  |

## Bug Details

### BUG-001: Title

- Severity:
- Environment:
- Browser/device:
- Test data:

Reproduction steps:

1. 
2. 
3. 

Expected result:

- 

Actual result:

- 

Attachments:

- Screenshot:
- Video:
- Trace:

Console/network errors:

```text
Paste relevant console or network errors here.
```

## API Test Details

| ID | Method | Endpoint | Request Data | Expected Status | Expected Body | Actual Status | Actual Body | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| API-001 |  |  |  |  |  |  |  |  |
| API-002 |  |  |  |  |  |  |  |  |

## Screenshots And Videos

| File | Scenario | Notes |
| --- | --- | --- |
|  |  |  |

## Console And Network Errors

| Scenario | Error Source | Message | Impact |
| --- | --- | --- | --- |
|  | Console |  |  |
|  | Network |  |  |

## Final Notes

- Main risks:
- Coverage gaps:
- Recommended follow-ups:
