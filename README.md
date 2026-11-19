# Committee Receipt

[Open Committee Receipt](https://coolcode.ca/committeereceipt/) · [CoolCode](https://coolcode.ca/)

Find the answer an MP requested in a hearing of the House of Commons Standing Committee on Government Operations and Estimates (OGGO). Search a speaker, topic, department or figure, narrow the index by hearing or written outcome, and open the original intervention and reply page. Each exchange has its own link.

<!-- coolcode:guide -->
Look up the tugboat challenge to find the roughly $193,000 on page 2 of the May 22 email. The department measured costs through March 31, and the reply came 71 days after the question.
<!-- /coolcode:guide -->

## Collection and sources

Nine hand-matched or reviewed exchanges from four hearings in the first session of the 43rd Parliament. The first hearing was March 12, 2020 and the last was May 29, 2020. Source documents retrieved and reviewed November 19, 2026. The selection contains five exchanges with figures, two where the office explicitly lacked an estimate or a central figure, one explanation and one exchange with no match in the records reviewed. Coverage is editorial and does not support committee-wide response rates.

| Hearing | Records in this index |
| --- | --- |
| [March 12, meeting 5](https://www.ourcommons.ca/DocumentViewer/en/43-1/OGGO/meeting-5/evidence) | Legal costs of emergency tug procurement challenges, Phoenix pay pods |
| [May 8, meeting 10](https://www.ourcommons.ca/DocumentViewer/en/43-1/OGGO/meeting-10/evidence) | Central cost information on equipment for working at home |
| [May 11, meeting 11](https://www.ourcommons.ca/DocumentViewer/en/43-1/OGGO/meeting-11/evidence) | Paper tax returns, CERB eligibility estimate, CRA call-centre staffing |
| [May 29, meeting 15](https://www.ourcommons.ca/DocumentViewer/en/43-1/OGGO/meeting-15/evidence) | Commercial rent assistance, household debt, subnational fiscal sustainability |

Every entry in [the source index](web/receipts.json) includes the member, organization, hearing date, transcript anchor, question paraphrase and measurement scope. Written answers include an exact PDF page and paragraph description. The question-to-reply interval uses calendar days from the hearing to the date on the covering letter or email. Undated answers have an unknown interval. A hearing date printed on a response is insufficient to date its transmission. The relevant official indexes are the [supplementary estimates study](https://www.ourcommons.ca/committees/en/OGGO/StudyActivity?studyActivityId=10794043) and [pandemic response study](https://www.ourcommons.ca/committees/en/OGGO/StudyActivity?studyActivityId=10820909).

The CRA eligibility entry records a specific search of the CRA and employment department follow-ups for the May 11 hearing linked from the pandemic study. The CRA paper mentions two further undertakings without identifying them. This review could not associate either with the estimate. The review says nothing about private correspondence or materials outside the stated scope.

## Working with the records

Open a PDF at its cited page or save it for use in [Evidence Lab](https://coolcode.ca/evidencelab/). Search and filtering run in the browser. Opening a source takes you to Parliament’s site. For a new match, verify both ends of the exchange, record what period any figure covers, add precise links and update the review date only after reviewing the collection.

Run `node --test tests/*.test.mjs`, `python3 -m unittest discover -s tests -v` and `python3 scripts/build.py`. Serve `dist/` from an HTTP server. Browser tests use the Python Playwright dependency listed under `tests/` and Chromium. Use `CHROMIUM_PATH` for a system installation. Main branch checks publish the tested output to GitHub Pages.
