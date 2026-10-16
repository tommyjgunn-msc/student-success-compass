"""Builds docs/Compass-v2-Design-Rationale-v1.0.docx and .pdf.

Run from anywhere:
    python3 docs/_build-src/build_rationale.py
Needs python-docx and LibreOffice (for the PDF).
"""
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from style import (  # noqa: E402
    GREEN, NAVY, OLIVE, RED, STEEL, T_BLUE, T_CREAM, T_GREEN, T_GREY, T_RED,
    banner, body, bullets, callout, clause_box, cover, fact, grid, h2, h3, new_doc, part_head, statstrip,
)

OUT_DIR = os.path.dirname(HERE)
NAME = "Compass-v2-Design-Rationale-v1.0"

doc = new_doc()

cover(
    doc,
    "African Leadership College of Higher Education",
    "Student Success",
    "Student Success Compass, version 2.0",
    "Design Rationale",
    "What the Compass is for, what the research says, and what changed",
    "Version 1.0  |  16 October 2026  |  Prepared for the Student Success team",
)

statstrip(doc, [
    ("58 + 12 timed", "items in version 1", RED),
    ("about 45", "items in version 2, untimed", GREEN),
    ("10 min", "to complete", STEEL),
    ("3 tiers", "who to contact first", NAVY),
])

h2(doc, "Read this first")
grid(doc, ["Question", "Answer"], [
    ["What it is", "A ten-minute start-of-term check-in. Students get a letter of next steps; Student Success gets a ranked, reasoned list of who to contact."],
    ["Who takes it", "All four current intakes: F25, O25, F26 and O26. O26 students see questions about starting university; the others see questions about how last term went."],
    ["Status", "Built, tested and running on a preview branch. Not yet live. Same Vercel project, sheet and environment variables as version 1."],
    ["What was cut", "The ADHD-style attention screen, the dyslexia-style reading screen, the timed reasoning test, the grit score and the traffic-light results."],
    ["What you need to decide", "Ten items, listed in Part 9. Four of them must be settled before go-live."],
], widths=[1.6, 4.9])

# ---------------------------------------------------------------------------
part_head(doc, "1. What the Compass is for", new_page=True)
fact(doc, "The Compass does two jobs at once, and a third for the data system.")
body(doc, "Reading the version 1 site, its repository, the orientation deck that points students to it, and the Compass Weekly pipeline that consumes its scores, the purpose comes out as three jobs:")
clause_box(doc, 1, "For the student", "A short, honest look at how they are starting the term, and a small number of concrete things to do next, tied to support that actually exists at ALCHE. It should also make asking for help feel normal.", T_BLUE, STEEL, STEEL)
clause_box(doc, 2, "For Student Success", "An early, consented picture of who would benefit from contact and about what, so a team of two staff and two interns spends its first weeks on the right students. Students who will not ask for help must be found, because they will not come.", T_GREEN, GREEN, GREEN)
clause_box(doc, 3, "For Compass Weekly", "One self-report engagement number per student. The weekly risk model gives it 20 per cent of the composite and uses it to spot students whose self-report and Canvas behaviour disagree.", T_CREAM, OLIVE, OLIVE)
body(doc, "Every question in version 2 had to serve at least one of these. Questions that served none were cut.")

# ---------------------------------------------------------------------------
part_head(doc, "2. What the research says to measure")
fact(doc, "Measure what predicts persistence and what the team can act on. Leave diagnosis to clinicians.")
grid(doc, ["What", "Evidence", "What the team does with it"], [
    ["Academic confidence (self-efficacy)", "The strongest single psychological correlate of university GPA among 50 measures (Richardson, Abraham and Bond, 2012). Also predicts retention (Robbins and others, 2004).", "Pairs low confidence with early, small wins: office hours, peer recap."],
    ["Study skills and strategies", "Academic-related skills predict retention about as well as confidence (Robbins and others, 2004). Self-testing and spaced practice are the two high-utility techniques; rereading and highlighting are low (Dunlosky and others, 2013).", "Studenting 101, Adulting 101 Time Management."],
    ["Goals and programme fit", "Academic goals and institutional commitment predict staying (Robbins and others, 2004).", "Referral to Student Professional Development."],
    ["Belonging", "Belonging uncertainty depresses achievement; in a 22-institution trial, a brief belonging message raised first-year full-time completion for students from groups that usually progress at lower rates, where those groups had real chances to belong (Walton and Cohen, 2007; Walton and others, 2023).", "Peer recap, learning communities, and a normalising message in every letter."],
    ["Help-seeking", "The students who most need help are the least likely to ask; students expecting a D or lower almost never used help (Karabenick and Knapp, 1988, 1991).", "These students are flagged so staff go to them."],
    ["Wellbeing", "WHO-5: five items, free for non-commercial use, validated worldwide. Below 50 out of 100 indicates poor wellbeing (WHO, 2024; Topp and others, 2015).", "Check-in; counselling referral; helplines in the letter."],
    ["Practical load", "Money worries, basic-needs insecurity, long paid-work hours and poor device access are consistently linked to dropping out.", "Referral, planning, Adulting 101 Financial Literacy."],
], widths=[1.55, 3.0, 1.95])

h3(doc, "How to ask")
bullets(doc, [
    "**Use answer options worded for each question** rather than a general agree-to-disagree scale. They produce noticeably better data and reduce the habit of agreeing with everything (Saris and others, 2010).",
    "**Include reverse-worded items** so a student who taps the same answer all the way down is visible.",
    "**One question per screen on phones.** Grids on small screens increase straight-lining and drop-out.",
    "**Let students skip anything.** Forced answers on sensitive items produce guesses, not data, and consent has to be real.",
])

h3(doc, "How to report back")
bullets(doc, [
    "**Point feedback at the task, not the person.** In a meta-analysis of 607 effects, more than a third of feedback interventions made performance worse, and feedback that drew attention to the self rather than the task did least well (Kluger and DeNisi, 1996).",
    "**Do not frame anything as a test of ability.** Calling a task diagnostic of ability lowered the scores of students who carried a negative stereotype (Steele and Aronson, 1995).",
    "**Pair high standards with assurance.** Critical feedback framed as high standards plus belief in the student raised revision rates and trust (Yeager and others, 2014).",
])

# ---------------------------------------------------------------------------
part_head(doc, "3. Audit of version 1")
fact(doc, "Version 1 asked good questions about engagement, and three kinds of question it could not use safely.")
grid(doc, ["Section", "Verdict", "Why"], [
    ["A. Foundation (6 items)", "Rework", "The language item mixed English comfort with translation-tool use. The three wellbeing items were invented and unvalidated; WHO-5 replaces them. Prior performance is now asked only of continuing students, about last term."],
    ["B. Learning profile (15 items)", "Remove", "Six items were the WHO adult ADHD screener (ASRS) with made-up thresholds. In two large samples of young adults, 86 to 90 per cent of positive ADHD screens were likely false (Chamberlain, Cortese and Grant, 2021). The reading items read second-language students as possible dyslexics. Students saw red 'Recommend follow-up' and 'consider assessment referral' labels. The team cannot diagnose or refer clinically from this. Replaced by one voluntary disclosure question."],
    ["C. Engagement (30 items)", "Rework", "Good constructs, but all 30 were agree-or-disagree and all positively worded, so habitual agreeing inflated every score. Cut to 22 items with item-specific answers, reverse items and the validated belonging-uncertainty items."],
    ["Grit indicator", "Remove", "Six items borrowed from other scales, none from a grit measure. Grit itself is largely conscientiousness and predicts performance only modestly (Credé, Tynan and Harms, 2017)."],
    ["D. Timed thinking test (12 items)", "Remove", "Four items per skill cannot measure anything reliably. Timed, ability-framed testing risks stereotype threat. ALCHE already holds academic records. Some items assumed dollars and Western retail."],
    ["E. Reflection", "Keep and extend", "Strengths, support wanted and contact preference are the most actionable answers in the form. Options now map to real ALCHE offers."],
    ["Results page", "Replace", "Traffic lights, red HIGH labels, scores out of 150 and 4, and referrals to services ALCHE does not have under those names (Math Lab, Disability Services, Counseling Services)."],
], widths=[1.6, 0.9, 4.0])

callout(doc, "What this changes for you", [
    "Compass Weekly's 10 per cent 'subjective cognitive' input has no version 2 equivalent. Use the **Confidence** index in its place, or let the model re-weight it away.",
    "Version 1 and version 2 numbers are on different scales. Do not mix them in one roster column. To compare, rescale version 1 Total Engagement as (score minus 30) divided by 120, times 100.",
], fill=T_CREAM, bar=RED)

# ---------------------------------------------------------------------------
part_head(doc, "4. What version 2 asks")
fact(doc, "Seven short parts, about 45 taps, untimed, with an intro screen for each part.")
grid(doc, ["Part", "Items", "What it covers"], [
    ["1. Your starting point", "9", "Feelings about the term; first time at university (new) or how last term went (continuing); first-generation status; language of schooling; previous school's teaching style (new); living situation; device and internet; paid work and caring hours; money worries; prior use of Student Success (continuing)."],
    ["2. How you study", "7", "Planning, starting early, self-testing, spacing, rereading, asking classmates, focus (reverse-worded). Frequency answers, never to always."],
    ["3. Your confidence", "8", "Hardest material, assessments, juggling deadlines (the self-efficacy index), then reading, writing, numbers, presenting and research (each points to a service)."],
    ["4. Direction", "3", "Goal clarity, course relevance, programme fit."],
    ["5. Belonging and support", "6", "Three belonging-uncertainty items (Walton and Cohen, 2007), someone to turn to, first move when struggling, how asking for help feels."],
    ["6. Wellbeing", "5", "WHO-5, verbatim, with WHO's attribution."],
    ["7. What would help", "7 or 8", "Strengths, support wanted, voluntary disability or learning-difference disclosure, preferred format, contact method, optional WhatsApp number, two optional free-text answers."],
], widths=[1.6, 0.6, 4.3])

# ---------------------------------------------------------------------------
part_head(doc, "5. How answers become action")
fact(doc, "Scoring runs on the server. The browser sends answers only, so nobody can change what staff see by editing a request.")
h3(doc, "Six indices, 0 to 100")
body(doc, "Study Habits, Confidence, Direction, Belonging and Help Seeking are each the mean of their items, rescaled. **Engagement** is the mean of those five and is the number for Compass Weekly. **Wellbeing** is the standard WHO-5 percentage. An index is left blank, never guessed, when fewer than half its items were answered.")

h3(doc, "Flags staff can read")
body(doc, "Each flag is written in the sheet as a code and explained in plain English in the codebook tab. The welfare flags are: wellbeing low or urgent, money, access, load (more than 20 hours of work or caring), connection, and help-avoidant. Skills flags cover writing, reading, numbers, speaking, research, study strategies and time. Context flags cover transition, learning support and continuing students who never knew Student Success existed. A brand-new student with nobody to turn to 'yet' is not flagged in week one.")

h3(doc, "Outreach tiers")
grid(doc, ["Tier", "Rule", "Letter tells the student"], [
    ["1  Within 2 working days", "WHO-5 of 28 or below; or help-avoidant together with low wellbeing, money worries or no connection; or three or more welfare flags.", "Someone will check in within two working days."],
    ["2  Within 2 weeks", "Any welfare flag, a learning-support request, any support the student asked for, or two or more skills flags.", "Someone will be in touch within two weeks, unless the student said they would rather reach out themselves."],
    ["3  Welcome only", "Everything else.", "Nothing else to do; workshop details will come by email."],
], widths=[1.55, 3.0, 1.95])
body(doc, "Two quality checks mark rows to treat with care: **fast** (under 150 seconds) and **straightline** (identical answers through whole sections, including a reverse-worded item).")

# ---------------------------------------------------------------------------
part_head(doc, "6. What students receive")
fact(doc, "A dated letter from Student Success, not a dashboard. No scores, no colours, no rankings.")
bullets(doc, [
    "**Strengths first,** in the student's own words.",
    "**Three or four next steps,** each a real ALCHE offer with how to take it: office hours, peer recap, Studenting 101, Adulting 101, Writing Support and Naissance, Library research mentorship, Student Professional Development. Wellbeing, learning support, money and access come first when they apply. When two or more of the last three apply, they become one 'use your check-in to talk about it' step.",
    "**Where you are starting:** five areas described in words. When three or more are low, the table is replaced by one kind paragraph, so a struggling student never reads five negatives in a row.",
    "**A settling-in message** for new students, and a hard-term message for continuing ones, drawn from the belonging research.",
    "**Help now:** Befrienders Mauritius (800 9393, WhatsApp +230 5483 7233), 114 and 999, and Find A Helpline for students outside Mauritius. Shown prominently when WHO-5 is below 50, quietly otherwise.",
    "**What happens next,** matched to the tier and the student's contact preference, and how to see, correct or delete their data.",
])
body(doc, "The letter prints cleanly to A4 or saves as PDF. It stays in the browser tab until the student presses Finish.")

# ---------------------------------------------------------------------------
part_head(doc, "7. Privacy, ethics and security")
fact(doc, "Wellbeing and health answers are special-category data under the Mauritius Data Protection Act 2017. Version 2 asks for explicit consent first and lets students skip any question.")
grid(doc, ["Area", "Version 1", "Version 2"], [
    ["Consent", "Told students afterwards that answers had gone to the team.", "Consent screen before any question; full privacy notice; versioned consent recorded on each row."],
    ["Scoring", "Calculated in the browser and trusted by the server.", "Recalculated on the server from validated answers; every value checked against the question bank."],
    ["Admin access", "Key in the URL (?key=), so in browser history and server logs; plain string comparison.", "Password form; constant-time check; signed HttpOnly SameSite=Strict session for 8 hours; sign-in rate limit."],
    ["Request forgery", "None.", "Cross-site POSTs refused; body size capped; honeypot field; per-IP rate limits sized for a shared campus network."],
    ["Headers", "Framework defaults.", "Per-request nonce Content-Security-Policy, HSTS, no framing, no sniffing, strict referrer and permissions policies."],
    ["Software", "Next.js 14.2.3, which has many published security advisories; the 100 MB googleapis package.", "Next.js 16.4.2 and React 19.3.1; a small Sheets client; no known vulnerabilities in production dependencies at build time."],
    ["Third parties", "Google Fonts loaded from Google on every visit.", "Fonts self-hosted at build time; no trackers or external scripts on any page."],
    ["Spreadsheet safety", "Raw text written as typed.", "Text that a spreadsheet could read as a formula is defused before writing."],
    ["Storage on device", "None; a refresh lost everything.", "Progress kept in session storage only, cleared when the tab closes, which matters on shared lab computers."],
], widths=[1.35, 2.35, 2.8])

# ---------------------------------------------------------------------------
part_head(doc, "8. Checking that it works")
fact(doc, "No new questionnaire is valid on day one. Check it after the first term and change what does not hold up.")
bullets(doc, [
    "**Reliability:** compute Cronbach's alpha for Study Habits, Confidence, Direction and Belonging. Aim for 0.70 or above; drop or rewrite the weakest item where a scale falls short.",
    "**Spread:** look for ceiling effects. If most students score above 80 on an index, the items are too easy to agree with.",
    "**Prediction:** by week 6, compare Engagement and Confidence with Compass Weekly's Canvas-based risk. They should correlate modestly; if they do not, the self-report is not adding information.",
    "**Follow-up:** record how many Tier 1 students were contacted within two working days. If the team cannot keep that promise, change the promise in the letter.",
    "**Usefulness:** ask a sample of students at week 4 whether they did any of their next steps.",
])

# ---------------------------------------------------------------------------
part_head(doc, "9. Decisions for you")
fact(doc, "Items 1 to 4 must be settled before version 2 goes live.")
decisions = [
    ("Data contact", "The letter and privacy notice name jipinmoye@alueducation.com for access and deletion requests. Confirm, or give a team inbox. Edit SITE.dataContactEmail in src/lib/config.ts."),
    ("Retention", "The privacy notice says answers are deleted within twelve months of a student leaving. Confirm this matches ALCHE's records policy."),
    ("Who reads the answers", "The site promises that only Student Success staff read answers and that nothing is used in academic decisions. Interns are students; they should see tiers and next steps, not raw wellbeing or disability answers. Confirm the sheet's sharing matches."),
    ("Response promises", "Tier 1 promises contact within two working days and Tier 2 within two weeks. Confirm the team can keep both at the start of term, when every intake answers at once."),
    ("Office-hours booking link", "If there is one, add it as LINKS.officeHours; the letter then shows a booking link instead of 'reply when we contact you'."),
    ("Safeguarding line", "The privacy notice says ALCHE welfare staff may be involved if someone is at serious risk, and the student will be told. Confirm this matches ALCHE's procedure."),
    ("Foundation Programme", "It is listed as a programme option. Remove it from PROGRAMMES if no Foundation students take the Compass this term."),
    ("Rotate the admin key", "The version 1 key travelled in URLs. Replace ADMIN_SECRET_KEY in Vercel after go-live."),
    ("Subdomain", "Ask ALU IT for compass.alueducation.com (or similar) as a CNAME to cname.vercel-dns.com, then add it in Vercel. Steps are in SETUP.md."),
    ("Compass Weekly", "When the pipeline resumes, copy the Engagement column into score_total_engagement and decide whether Confidence replaces score_total_cognitive."),
]
for i, (label, text) in enumerate(decisions, start=1):
    fill, bar = (T_RED, RED) if i <= 4 else (T_GREY, STEEL)
    clause_box(doc, i, label, text, fill, bar, bar)

# ---------------------------------------------------------------------------
part_head(doc, "References", new_page=True)
refs = [
    "Chamberlain, S. R., Cortese, S., and Grant, J. E. (2021). Screening for adult ADHD using brief rating tools: What can we conclude from a positive screen? Some caveats. Comprehensive Psychiatry, 106, 152224.",
    "Credé, M., Tynan, M. C., and Harms, P. D. (2017). Much ado about grit: A meta-analytic synthesis of the grit literature. Journal of Personality and Social Psychology, 113(3), 492 to 511.",
    "Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., and Willingham, D. T. (2013). Improving students' learning with effective learning techniques. Psychological Science in the Public Interest, 14(1), 4 to 58.",
    "Karabenick, S. A., and Knapp, J. R. (1988). Help seeking and the need for academic assistance. Journal of Educational Psychology, 80(3), 406 to 408.",
    "Karabenick, S. A., and Knapp, J. R. (1991). Relationship of academic help seeking to the use of learning strategies and other instrumental achievement behavior in college students. Journal of Educational Psychology, 83(2), 221 to 230.",
    "Kluger, A. N., and DeNisi, A. (1996). The effects of feedback interventions on performance. Psychological Bulletin, 119(2), 254 to 284.",
    "Richardson, M., Abraham, C., and Bond, R. (2012). Psychological correlates of university students' academic performance: A systematic review and meta-analysis. Psychological Bulletin, 138(2), 353 to 387.",
    "Robbins, S. B., Lauver, K., Le, H., Davis, D., Langley, R., and Carlstrom, A. (2004). Do psychosocial and study skill factors predict college outcomes? A meta-analysis. Psychological Bulletin, 130(2), 261 to 288.",
    "Saris, W. E., Revilla, M., Krosnick, J. A., and Shaeffer, E. M. (2010). Comparing questions with agree/disagree response options to questions with item-specific response options. Survey Research Methods, 4(1), 61 to 79.",
    "Steele, C. M., and Aronson, J. (1995). Stereotype threat and the intellectual test performance of African Americans. Journal of Personality and Social Psychology, 69(5), 797 to 811.",
    "Topp, C. W., Østergaard, S. D., Søndergaard, S., and Bech, P. (2015). The WHO-5 Well-Being Index: A systematic review of the literature. Psychotherapy and Psychosomatics, 84(3), 167 to 176.",
    "Walton, G. M., and Cohen, G. L. (2007). A question of belonging: Race, social fit, and achievement. Journal of Personality and Social Psychology, 92(1), 82 to 96.",
    "Walton, G. M., and others (2023). Where and with whom does a brief social-belonging intervention promote progress in college? Science, 380(6644), 499 to 505.",
    "World Health Organization (2024). The World Health Organization-Five Well-Being Index (WHO-5). Geneva: WHO. Licence: CC BY-NC-SA 3.0 IGO.",
    "Yeager, D. S., and others (2014). Breaking the cycle of mistrust: Wise interventions to provide critical feedback across the racial divide. Journal of Experimental Psychology: General, 143(2), 804 to 824.",
]
for r in refs:
    body(doc, r, size=9.5, space_after=5)

docx_path = os.path.join(OUT_DIR, f"{NAME}.docx")
doc.save(docx_path)
print("wrote", docx_path)

soffice = "/Applications/LibreOffice.app/Contents/MacOS/soffice"
if os.path.exists(soffice):
    subprocess.run([soffice, "--headless", "--convert-to", "pdf", "--outdir", OUT_DIR, docx_path], check=True,
                   stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    print("wrote", os.path.join(OUT_DIR, f"{NAME}.pdf"))
