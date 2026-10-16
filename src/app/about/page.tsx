import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Why these questions' };

export default function AboutPage() {
  return (
    <div className="column prose">
      <p className="eyebrow">About the Compass</p>
      <h1 className="title">Why we ask these questions</h1>
      <p className="lede">
        The Compass has two jobs. It gives you a short, honest look at how you are starting the term, with next steps you
        can act on. And it tells Student Success, early, who would benefit from a conversation and about what.
      </p>
      <p>
        Every question had to earn its place. Each one either predicts how students get on at university, decides what we
        offer you, or helps us notice when a term is going wrong. Questions that did none of these were cut.
      </p>

      <h2>What we ask, and why</h2>

      <h3>Your starting point</h3>
      <p>
        Money worries, long hours of paid work or caring, unreliable internet, living away from home for the first time,
        and arriving from a lecture-and-exam school system all make the first months harder. Each of them is
        something we can help with, once we know about it.
      </p>

      <h3>How you study</h3>
      <p>
        Study skills are one of the clearest predictors of staying on and doing well at university (Robbins and others,
        2004). We ask about specific habits rather than general ones. Testing yourself and spreading study over several
        days are among the most effective ways to learn; rereading and highlighting feel productive but do much less
        (Dunlosky and others, 2013). These habits can be taught, which is why they lead straight to a workshop.
      </p>

      <h3>Your confidence</h3>
      <p>
        How sure you are that you can handle your courses is the strongest single psychological predictor of university
        grades found so far (Richardson, Abraham and Bond, 2012). Confidence grows with practice, early success and
        support. The skills questions (reading, writing, numbers, presenting, research) each point to a
        specific service.
      </p>

      <h3>Direction</h3>
      <p>
        Students with clear goals, who see how their courses connect to their future, are more likely to stay (Robbins
        and others, 2004). If you are unsure, that is common, and a conversation with Student Professional Development
        can help.
      </p>

      <h3>Belonging and support</h3>
      <p>
        Wondering whether you really belong is a normal part of starting somewhere new. When it goes unspoken it can
        quietly wear people down; when students learn that others feel it too, they do better (Walton and Cohen, 2007;
        Walton and others, 2023). We also ask what you would do if you were struggling, because the students who most
        need help are often the least likely to ask for it (Karabenick and Knapp, 1991). If that is you, we will come to
        you.
      </p>

      <h3>Wellbeing</h3>
      <p>
        These five questions are the World Health Organization’s WHO-5 Well-Being Index, used and tested around the
        world (Topp and others, 2015). A low score is a reason for us to check in, and the
        letter you receive tells you where to find help straight away.
      </p>

      <h2>What the Compass does not do</h2>
      <ul>
        <li>
          <strong>It does not diagnose anything.</strong> Short questionnaires that screen for conditions such as ADHD or
          dyslexia flag many people who do not have them; in two large samples of young adults, most positive ADHD screens
          were likely false alarms (Chamberlain, Cortese and Grant, 2021). For students learning in a second or third language, reading
          questions also mix up language with learning difference. So instead we simply ask whether you have, or think
          you might have, a learning difference you would like to talk about.
        </li>
        <li>
          <strong>It does not test your intelligence.</strong> An earlier version included a short timed reasoning test.
          Four questions per skill is too few to measure anything reliably, timed tests framed as measures of ability can
          lower the scores of the very students they are meant to help (Steele and Aronson, 1995), and ALCHE already
          knows your academic record.
        </li>
        <li>
          <strong>It does not score you against other students.</strong> Your letter describes your own answers in words
          and pairs each one with something to do. Feedback that focuses on the person rather than the next task tends to
          make performance worse, not better (Kluger and DeNisi, 1996).
        </li>
      </ul>

      <h2>How the answers are used</h2>
      <p>
        Your answers are scored on the server, not in your browser. Student Success staff see your answers, a short list
        of reasons to get in touch, and a suggested order for contacting students, so the people who need us most hear
        from us first. A single engagement score joins your Canvas activity in the team’s weekly review. The{' '}
        <Link href="/privacy">privacy notice</Link> covers who can see what, and how to have your answers deleted.
      </p>
      <p>
        Most questions offer answers worded for that question rather than a general agree-to-disagree scale, which gives
        more accurate answers (Saris and others, 2010).
      </p>

      <h2>References</h2>
      <ol className="refs">
        <li>
          Chamberlain, S. R., Cortese, S., and Grant, J. E. (2021). Screening for adult ADHD using brief rating tools:
          What can we conclude from a positive screen? Some caveats. <em>Comprehensive Psychiatry</em>, 106, 152224.
        </li>
        <li>
          Dunlosky, J., Rawson, K. A., Marsh, E. J., Nathan, M. J., and Willingham, D. T. (2013). Improving students’
          learning with effective learning techniques. <em>Psychological Science in the Public Interest</em>, 14(1), 4 to 58.
        </li>
        <li>
          Karabenick, S. A., and Knapp, J. R. (1991). Relationship of academic help seeking to the use of learning
          strategies and other instrumental achievement behavior in college students. <em>Journal of Educational
          Psychology</em>, 83(2), 221 to 230.
        </li>
        <li>
          Kluger, A. N., and DeNisi, A. (1996). The effects of feedback interventions on performance.{' '}
          <em>Psychological Bulletin</em>, 119(2), 254 to 284.
        </li>
        <li>
          Richardson, M., Abraham, C., and Bond, R. (2012). Psychological correlates of university students’ academic
          performance: A systematic review and meta-analysis. <em>Psychological Bulletin</em>, 138(2), 353 to 387.
        </li>
        <li>
          Robbins, S. B., Lauver, K., Le, H., Davis, D., Langley, R., and Carlstrom, A. (2004). Do psychosocial and study
          skill factors predict college outcomes? A meta-analysis. <em>Psychological Bulletin</em>, 130(2), 261 to 288.
        </li>
        <li>
          Saris, W. E., Revilla, M., Krosnick, J. A., and Shaeffer, E. M. (2010). Comparing questions with agree/disagree
          response options to questions with item-specific response options. <em>Survey Research Methods</em>, 4(1), 61
          to 79.
        </li>
        <li>
          Steele, C. M., and Aronson, J. (1995). Stereotype threat and the intellectual test performance of African
          Americans. <em>Journal of Personality and Social Psychology</em>, 69(5), 797 to 811.
        </li>
        <li>
          Topp, C. W., Østergaard, S. D., Søndergaard, S., and Bech, P. (2015). The WHO-5 Well-Being Index: A systematic
          review of the literature. <em>Psychotherapy and Psychosomatics</em>, 84(3), 167 to 176.
        </li>
        <li>
          Walton, G. M., and Cohen, G. L. (2007). A question of belonging: Race, social fit, and achievement.{' '}
          <em>Journal of Personality and Social Psychology</em>, 92(1), 82 to 96.
        </li>
        <li>
          Walton, G. M., and others (2023). Where and with whom does a brief social-belonging intervention promote
          progress in college? <em>Science</em>, 380(6644), 499 to 505.
        </li>
        <li>
          World Health Organization (2024). <em>The World Health Organization-Five Well-Being Index (WHO-5)</em>. Geneva:
          WHO. Licence: CC BY-NC-SA 3.0 IGO.
        </li>
      </ol>
    </div>
  );
}
