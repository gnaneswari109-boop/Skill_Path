export interface VideoResource {
  id: string; // YouTube video ID (verified embeddable)
  title: string;
  channelName: string;
  duration: string;
  description: string;
  youtubeUrl: string;
  thumbnailUrl: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface PracticalAssignment {
  title: string;
  instructions: string;
  starterCode?: string;
  expectedOutput: string;
  hint: string;
}

export interface DailyLearningDay {
  dayNumber: number;
  title: string;
  topic: string;
  learningObjective: string;
  totalTimeMinutes: number; // default 45
  skillLevel: string;
  language: string;
  video: VideoResource;
  notes: {
    heading: string;
    keyPoints: string[];
    codeSnippet?: string;
  };
  quiz: QuizQuestion[];
  assignment: PracticalAssignment;
  reflectionPrompt: string;
}

export interface MemberRoadmapTrack {
  memberId: string;
  trackName: string;
  tagline: string;
  primarySkills: string[];
  days: DailyLearningDay[];
}

export const DAILY_ROADMAP_TRACKS: Record<string, MemberRoadmapTrack> = {
  // 1. Ananya Reddy - AI/ML Track
  user_member_ananya: {
    memberId: 'user_member_ananya',
    trackName: 'AI & Machine Learning Engineering',
    tagline: 'From tabular predictive modeling to neural network architectures and explainability.',
    primarySkills: ['Python', 'Machine Learning', 'SQL', 'Data Analysis'],
    days: [
      {
        dayNumber: 1,
        title: 'Python for AI: Vectorization & Memory-Efficient Arrays',
        topic: 'Python & NumPy',
        learningObjective: 'Master vectorized matrix operations, broadcasting, and avoid sluggish Python for-loops in machine learning pipelines.',
        totalTimeMinutes: 45,
        skillLevel: 'Core Foundations',
        language: 'English',
        video: {
          id: 'rfscVS0vtbw',
          title: 'Python for Beginners — Data Structures & Vectorized Math',
          channelName: 'freeCodeCamp.org',
          duration: '15:10',
          description: 'Learn how NumPy arrays operate in contiguous C memory buffers and how broadcasting accelerates tabular calculations.',
          youtubeUrl: 'https://www.youtube.com/watch?v=rfscVS0vtbw',
          thumbnailUrl: 'https://img.youtube.com/vi/rfscVS0vtbw/hqdefault.jpg'
        },
        notes: {
          heading: 'Core Rules of NumPy Vectorization',
          keyPoints: [
            'Avoid Python-level loops for element-wise array operations; NumPy pushes loops down to optimized C / SIMD hardware.',
            'Broadcasting rule: trailing dimensions must either match or one of them must be 1.',
            'Memory layout matters: slicing creates a view, whereas indexing with conditions or boolean masks produces a copy.'
          ],
          codeSnippet: `import numpy as np

# Vectorized Euclidean Distance calculation
def batch_distance(X, centroid):
    # (N, D) - (D,) broadcasts automatically without loops
    return np.sqrt(np.sum((X - centroid) ** 2, axis=1))`
        },
        quiz: [
          {
            id: 'an_q1_1',
            question: 'Why are NumPy vectorized operations significantly faster than Python for-loops?',
            options: [
              'Because Python loops run in background threads',
              'Because NumPy executes operations in compiled C code with contiguous memory layouts',
              'Because NumPy converts code into JavaScript V8 bytecode',
              'Because NumPy compresses numerical data in RAM'
            ],
            correctOptionIndex: 1,
            explanation: 'NumPy arrays store elements in contiguous memory buffers without Python object header overhead and execute loops in compiled C and BLAS/LAPACK routines.'
          },
          {
            id: 'an_q2_1',
            question: 'What happens when you slice a NumPy array (e.g. sub = arr[0:5])?',
            options: [
              'A completely independent deep copy of the memory is created',
              'A memory view is returned that shares the underlying data buffer',
              'The array is automatically converted to an immutable tuple',
              'An IndexError is thrown if the size is not divisible by 2'
            ],
            correctOptionIndex: 1,
            explanation: 'Basic array slicing returns a view of the original memory buffer, which is O(1) in memory and time.'
          },
          {
            id: 'an_q3_1',
            question: 'Which of the following array shapes can be broadcast together according to NumPy rules?',
            options: [
              '(10, 3) and (10, 4)',
              '(8, 1, 6) and (8, 5, 1)',
              '(4, 2) and (2, 4)',
              '(3, 5) and (5, 3)'
            ],
            correctOptionIndex: 1,
            explanation: 'Working backwards from the trailing dimension: 6 and 1 (valid -> 6), 1 and 5 (valid -> 5), 8 and 8 (valid -> 8). Result is (8, 5, 6).'
          }
        ],
        assignment: {
          title: 'Implement Vectorized Min-Max Feature Scaling',
          instructions: 'Write a vectorized function normalize_features(X) that scales each column of a 2D matrix X to the range [0.0, 1.0] without using any for-loops.',
          starterCode: `import numpy as np

def normalize_features(X):
    # Compute min and max along column axis (axis=0)
    col_min = np.min(X, axis=0)
    col_max = np.max(X, axis=0)
    
    # Avoid zero-division by replacing 0 range with 1
    diff = col_max - col_min
    diff[diff == 0] = 1.0
    
    # Broadcast subtraction and division
    return (X - col_min) / diff`,
          expectedOutput: 'Normalized array where all columns fall within [0.0, 1.0]',
          hint: 'Remember axis=0 collapses rows, computing min/max per column!'
        },
        reflectionPrompt: 'Did understanding array views versus copies change how you think about memory in data pipelines?'
      },
      {
        dayNumber: 2,
        title: 'Machine Learning Fundamentals: Bias-Variance & Overfitting',
        topic: 'Machine Learning',
        learningObjective: 'Diagnose high-bias versus high-variance regimes using cross-validation learning curves and regularization techniques.',
        totalTimeMinutes: 45,
        skillLevel: 'Core Foundations',
        language: 'English',
        video: {
          id: 'Gv9_4yMHFhI',
          title: 'Machine Learning Fundamentals — Bias and Variance',
          channelName: 'StatQuest with Josh Starmer',
          duration: '14:45',
          description: 'A crisp, intuitive breakdown of training error, testing error, overfitting, and regularization.',
          youtubeUrl: 'https://www.youtube.com/watch?v=Gv9_4yMHFhI',
          thumbnailUrl: 'https://img.youtube.com/vi/Gv9_4yMHFhI/hqdefault.jpg'
        },
        notes: {
          heading: 'Diagnosing Model Generalization',
          keyPoints: [
            'High Bias (Underfitting): Model is overly simplistic; both training error and test error are unacceptably high.',
            'High Variance (Overfitting): Model memorizes training noise; training error is near-zero while test error spikes.',
            'Regularization (L1 Lasso / L2 Ridge) penalizes excessive weights to keep the decision boundary smoother.'
          ],
          codeSnippet: `from sklearn.linear_model import Ridge, Lasso
from sklearn.model_selection import cross_val_score

# L2 Regularization (Ridge) shrinks large coefficients towards 0
ridge_model = Ridge(alpha=1.0)
scores = cross_val_score(ridge_model, X, y, cv=5, scoring='neg_mean_squared_error')`
        },
        quiz: [
          {
            id: 'an_q2_1',
            question: 'What is the primary indicator that a machine learning model is suffering from high variance?',
            options: [
              'Training error and validation error are both very high',
              'Training error is very low, but validation/test error is significantly higher',
              'The model trains in fewer than 2 epochs',
              'The ROC-AUC score is exactly 0.5'
            ],
            correctOptionIndex: 1,
            explanation: 'High variance indicates the model is fitting the idiosyncratic noise of the training split, losing generalizability on unseen validation data.'
          },
          {
            id: 'an_q2_2',
            question: 'How does L1 Regularization (Lasso) differ from L2 Regularization (Ridge)?',
            options: [
              'L1 drives non-essential feature weights to exact zeros, acting as built-in feature selection',
              'L1 only works on decision trees, whereas L2 works on neural networks',
              'L2 can only take integer hyperparameter values',
              'L1 always requires twice as many training epochs'
            ],
            correctOptionIndex: 0,
            explanation: 'L1 norm produces sparse parameter vectors by shrinking less informative weights all the way to 0.0.'
          },
          {
            id: 'an_q2_3',
            question: 'Which technique is effective at reducing high variance without changing model complexity?',
            options: [
              'Removing data points to speed up training',
              'Gathering more training samples or applying data augmentation',
              'Disabling early stopping in training loops',
              'Increasing polynomial degree features'
            ],
            correctOptionIndex: 1,
            explanation: 'Providing more diverse training samples restricts the ability of the model to overfit specific noisy outliers.'
          }
        ],
        assignment: {
          title: 'Tune Ridge Regularization Alpha via Cross-Validation',
          instructions: 'Set up an alpha grid sweep from 0.01 to 100.0 on a simulated dataset and identify the optimal alpha that minimizes test MSE.',
          starterCode: `from sklearn.linear_model import RidgeCV
import numpy as np

alphas = np.logspace(-2, 2, 20)
ridge_cv = RidgeCV(alphas=alphas, store_cv_results=True)
# ridge_cv.fit(X_train, y_train)
# best_alpha = ridge_cv.alpha_`,
          expectedOutput: 'Optimal alpha hyperparameter output with lowest cross-validation loss',
          hint: 'Using logarithmic spacing (logspace) gives good coverage across orders of magnitude.'
        },
        reflectionPrompt: 'In your Student Performance Prediction project, did you notice features with near-zero importance?'
      },
      {
        dayNumber: 3,
        title: 'SQL for Machine Learning: Aggregating Longitudinal Student Data',
        topic: 'SQL & Feature Prep',
        learningObjective: 'Formulate window functions and cohort aggregations in SQL to generate longitudinal features for predictive modeling.',
        totalTimeMinutes: 45,
        skillLevel: 'Intermediate',
        language: 'English',
        video: {
          id: 'HXV3zeRR3h4',
          title: 'SQL Tutorial — Full Database Course & Analytical Queries',
          channelName: 'freeCodeCamp.org',
          duration: '15:40',
          description: 'Master GROUP BY, HAVING, and window partitions to build clean training tables straight from the raw database.',
          youtubeUrl: 'https://www.youtube.com/watch?v=HXV3zeRR3h4',
          thumbnailUrl: 'https://img.youtube.com/vi/HXV3zeRR3h4/hqdefault.jpg'
        },
        notes: {
          heading: 'Building Machine Learning Features in SQL',
          keyPoints: [
            'Aggregation over time: Use window functions like AVG(grade) OVER (PARTITION BY student_id ORDER BY exam_date) to prevent data leakage.',
            'Never compute test features using future dates; rolling windows must only look backward.',
            'Coalesce null counts and use CASE WHEN statements to create binary flags.'
          ],
          codeSnippet: `SELECT 
  student_id,
  exam_date,
  score,
  AVG(score) OVER (
    PARTITION BY student_id 
    ORDER BY exam_date 
    ROWS BETWEEN 2 PRECEDING AND CURRENT ROW
  ) AS rolling_3_exam_avg
FROM student_scores;`
        },
        quiz: [
          {
            id: 'an_q3_1',
            question: 'What is data leakage when creating machine learning training sets in SQL?',
            options: [
              'When raw user passwords are leaked in error logs',
              'When features in training data accidentally incorporate information from the future or target event',
              'When a database connection times out mid-query',
              'When a CSV export is too large to fit in RAM'
            ],
            correctOptionIndex: 1,
            explanation: 'Data leakage happens when a model is trained on features that would not realistically be available at test/inference time, creating artificial high accuracy that fails in production.'
          },
          {
            id: 'an_q3_2',
            question: 'Which SQL clause restricts rows after an aggregate GROUP BY has already computed?',
            options: ['WHERE', 'HAVING', 'QUALIFY', 'LIMIT'],
            correctOptionIndex: 1,
            explanation: 'WHERE filters rows before grouping; HAVING filters the aggregated summary groups.'
          },
          {
            id: 'an_q3_3',
            question: 'How do you replace NULL attendance counts with 0 in SQL queries?',
            options: ['NULLIF(attendance, 0)', 'COALESCE(attendance, 0)', 'ISNULL(0, attendance)', 'CAST(attendance AS ZERO)'],
            correctOptionIndex: 1,
            explanation: 'COALESCE returns the first non-null argument in its list.'
          }
        ],
        assignment: {
          title: 'Write SQL Query for 30-Day Attendance Velocity',
          instructions: 'Draft an SQL query using COALESCE and conditional SUM to calculate the percentage of classes attended per student in the last 30 days.',
          starterCode: `SELECT 
  student_id,
  COUNT(*) AS total_sessions,
  SUM(CASE WHEN attended = 1 THEN 1 ELSE 0 END) AS attended_sessions,
  ROUND(
    100.0 * SUM(CASE WHEN attended = 1 THEN 1 ELSE 0 END) / COUNT(*), 
    2
  ) AS attendance_rate_pct
FROM attendance_logs
WHERE session_date >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY student_id;`,
          expectedOutput: 'Tabular student attendance percentage summary grouped by student_id',
          hint: 'Remember to cast to float/decimal before division to avoid integer truncation in Postgres.'
        },
        reflectionPrompt: 'Why is feature engineering in SQL often 10x faster than reading 10 million rows into Python memory first?'
      }
    ]
  },

  // 2. Rahul Varma - Full-Stack Developer Track
  user_member_rahul: {
    memberId: 'user_member_rahul',
    trackName: 'Modern Full-Stack Engineering (React & Node)',
    tagline: 'Building responsive frontend architectures, RESTful APIs, and scalable MongoDB schemas.',
    primarySkills: ['JavaScript', 'React', 'Node.js', 'MongoDB'],
    days: [
      {
        dayNumber: 1,
        title: 'React 19 State Architecture & Custom Hooks',
        topic: 'React & State',
        learningObjective: 'Master custom hook composition, clean state lifting, and preventing unnecessary component re-renders.',
        totalTimeMinutes: 45,
        skillLevel: 'Core Foundations',
        language: 'English',
        video: {
          id: 'bMknfKXIFA8',
          title: 'React Course for Beginners — Hooks, State & Component Architecture',
          channelName: 'freeCodeCamp.org',
          duration: '15:25',
          description: 'Deep dive into useState, useEffect cleanup, and abstracting data-fetching logic into reusable hooks.',
          youtubeUrl: 'https://www.youtube.com/watch?v=bMknfKXIFA8',
          thumbnailUrl: 'https://img.youtube.com/vi/bMknfKXIFA8/hqdefault.jpg'
        },
        notes: {
          heading: 'Principles of Clean React State',
          keyPoints: [
            'Avoid redundant state: if a value can be computed on the fly from props or existing state, do not store it in a separate useState.',
            'Custom hooks are functions starting with "use" that encapsulate reusable stateful logic without duplicating UI.',
            'Always return cleanup callbacks from useEffect to cancel listeners, web sockets, or abort ongoing fetches.'
          ],
          codeSnippet: `// Custom hook for resilient data fetching
export function useFetchData<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    fetch(url, { signal: controller.signal })
      .then(res => res.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(err => { if (err.name !== 'AbortError') setLoading(false); });

    return () => controller.abort(); // Clean up on unmount or URL change
  }, [url]);

  return { data, loading };
}`
        },
        quiz: [
          {
            id: 'rh_q1_1',
            question: 'What is the main benefit of extracting logic into a Custom Hook in React?',
            options: [
              'It makes the code execute faster on mobile devices',
              'It allows sharing stateful logic and side-effects across components without changing component hierarchy',
              'It automatically prevents all re-renders across the entire application',
              'It compiles JavaScript into WebAssembly'
            ],
            correctOptionIndex: 1,
            explanation: 'Custom hooks let you extract and reuse component logic (like data fetching, subscription, or local storage syncing) cleanly without higher-order component nesting.'
          },
          {
            id: 'rh_q1_2',
            question: 'Why should you include an AbortController in useEffect fetch calls?',
            options: [
              'To encrypt the payload over HTTPS',
              'To cancel stale in-flight requests when the component unmounts or query parameters change, preventing race conditions',
              'To force the server to respond within 1 second',
              'Because browser security prohibits fetch without an abort signal'
            ],
            correctOptionIndex: 1,
            explanation: 'AbortController prevents setting state on unmounted components and avoids out-of-order race conditions when users rapidly type or switch tabs.'
          },
          {
            id: 'rh_q1_3',
            question: 'When should you use useMemo in React?',
            options: [
              'On every single variable in every component',
              'Only when caching an expensive computation or preserving referential equality for dependency arrays',
              'Only for string concatenations',
              'Never in React 19'
            ],
            correctOptionIndex: 1,
            explanation: 'useMemo introduces memory and comparison overhead; it should be applied to genuinely heavy calculations or to stabilize object references passed to memoized children.'
          }
        ],
        assignment: {
          title: 'Build a useLocalStorage Custom Hook',
          instructions: 'Implement a reusable hook `useLocalStorage<T>(key, initialValue)` that synchronizes state with browser localStorage with JSON parsing and error handling.',
          starterCode: `import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.error(err);
    }
  }, [key, value]);

  return [value, setValue] as const;
}`,
          expectedOutput: 'Working hook that updates localStorage automatically whenever setValue is called',
          hint: 'Initialize state with a lazy function callback to avoid running getItem on every re-render.'
        },
        reflectionPrompt: 'How can you apply this custom hook in your Campus Connect project to preserve draft club announcements?'
      },
      {
        dayNumber: 2,
        title: 'Node.js & Express REST API: Security & Middleware',
        topic: 'Backend & APIs',
        learningObjective: 'Design robust Express middleware for request authentication, input validation, rate limiting, and centralized error handling.',
        totalTimeMinutes: 45,
        skillLevel: 'Core Foundations',
        language: 'English',
        video: {
          id: 'Oe421EPjeBE',
          title: 'Node.js and Express.js — Full Course for Beginners',
          channelName: 'freeCodeCamp.org',
          duration: '15:15',
          description: 'Learn request routing, HTTP headers, middleware execution order, and clean error forwarding with next(err).',
          youtubeUrl: 'https://www.youtube.com/watch?v=Oe421EPjeBE',
          thumbnailUrl: 'https://img.youtube.com/vi/Oe421EPjeBE/hqdefault.jpg'
        },
        notes: {
          heading: 'Middleware Execution Order in Express',
          keyPoints: [
            'Middleware executes in the exact order it is registered via app.use() or router.use().',
            'Always call next() to pass control to the next handler; forgetting next() leaves the client hanging forever.',
            'Centralized error middleware has 4 arguments: (err, req, res, next) so Express identifies it as an error catcher.'
          ],
          codeSnippet: `// Centralized Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('[API Error]:', err.message);
  const status = err.statusCode || 500;
  res.status(status).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});`
        },
        quiz: [
          {
            id: 'rh_q2_1',
            question: 'How does Express differentiate standard middleware from error-handling middleware?',
            options: [
              'By checking if the function has 4 declared arguments (err, req, res, next)',
              'By requiring the file name to end in .error.js',
              'By registering it with app.catch() instead of app.use()',
              'By returning a rejected Promise'
            ],
            correctOptionIndex: 0,
            explanation: 'JavaScript functions have a .length property denoting arity; Express checks fn.length === 4 to distinguish error handlers.'
          },
          {
            id: 'rh_q2_2',
            question: 'What is the purpose of the helmet middleware in production Express applications?',
            options: [
              'It speeds up database queries by 50%',
              'It sets secure HTTP response headers (Content-Security-Policy, X-Frame-Options, HSTS, etc.)',
              'It compresses responses with gzip',
              'It formats JSON payloads with pretty printing'
            ],
            correctOptionIndex: 1,
            explanation: 'Helmet sets essential security headers to mitigate common web vulnerabilities like clickjacking, MIME-sniffing, and cross-site scripting.'
          },
          {
            id: 'rh_q2_3',
            question: 'Where should sensitive JWT tokens preferably be stored on client browsers?',
            options: [
              'In plain localStorage accessible to any injected script',
              'In HTTP-only, secure, sameSite cookies to protect against XSS exfiltration',
              'In the window.name property',
              'In the URL query string'
            ],
            correctOptionIndex: 1,
            explanation: 'HTTP-only cookies cannot be read by JavaScript (document.cookie), dramatically mitigating the risk of credential theft via XSS.'
          }
        ],
        assignment: {
          title: 'Implement an Express Input Validation Middleware',
          instructions: 'Create an auth validation middleware verifying that req.body.email is a valid email format and password is at least 8 characters before reaching controller.',
          starterCode: `const validateAuthInput = (req, res, next) => {
  const { email, password } = req.body;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !emailRegex.test(email)) {
    return res.status(400).json({ error: 'A valid email address is required.' });
  }

  if (!password || password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
  }

  next(); // Passes cleanly to the route controller
};`,
          expectedOutput: 'Middleware that rejects invalid input with status 400 and calls next() on valid input',
          hint: 'Always return early when sending a response in middleware to prevent duplicate header errors.'
        },
        reflectionPrompt: 'Why is separating validation middleware from business logic controllers cleaner for testing?'
      },
      {
        dayNumber: 3,
        title: 'MongoDB Indexing & Schema Design for High Concurrency',
        topic: 'MongoDB & Database',
        learningObjective: 'Design compound indexes, understand B-Tree index scan patterns, and avoid full collection scans in high-traffic applications.',
        totalTimeMinutes: 45,
        skillLevel: 'Intermediate',
        language: 'English',
        video: {
          id: 'ofme2o29ngU',
          title: 'MongoDB Full Tutorial — Data Modeling & Indexes',
          channelName: 'freeCodeCamp.org',
          duration: '15:30',
          description: 'Understand the Equality, Sort, Range (ESR) rule when building compound indexes in MongoDB.',
          youtubeUrl: 'https://www.youtube.com/watch?v=ofme2o29ngU',
          thumbnailUrl: 'https://img.youtube.com/vi/ofme2o29ngU/hqdefault.jpg'
        },
        notes: {
          heading: 'The ESR Indexing Rule (Equality, Sort, Range)',
          keyPoints: [
            'Equality fields come first: fields queried with exact matches (e.g. { clubId: "tech_club" }).',
            'Sort fields come second: ordering fields (e.g. { createdAt: -1 }) to eliminate costly in-memory sorts.',
            'Range fields come last: inequality comparisons (e.g. { views: { $gt: 100 } }).',
            'Use db.collection.explain("executionStats") to verify index utilization.'
          ],
          codeSnippet: `// Schema with ESR compound index for campus threads
threadSchema.index(
  { clubId: 1, createdAt: -1, upvotes: -1 },
  { name: 'club_feed_perf_idx' }
);`
        },
        quiz: [
          {
            id: 'rh_q3_1',
            question: 'What does the ESR rule stand for in MongoDB compound index design?',
            options: [
              'Error, Syntax, Response',
              'Equality, Sort, Range',
              'Extract, Store, Replicate',
              'Entity, Schema, Relation'
            ],
            correctOptionIndex: 1,
            explanation: 'The ESR rule prescribes arranging index fields in order: 1) Equality matches, 2) Sort criteria, 3) Range filters, ensuring optimal index traversal.'
          },
          {
            id: 'rh_q3_2',
            question: 'What is the warning sign of an unindexed query in MongoDB explain() output?',
            options: [
              'stage: "IXSCAN"',
              'stage: "COLLSCAN" (Collection Scan)',
              'isMultiKey: true',
              'totalDocsExamined: 0'
            ],
            correctOptionIndex: 1,
            explanation: 'COLLSCAN means MongoDB had to scan every single document in the collection from beginning to end, leading to O(N) latency spikes.'
          },
          {
            id: 'rh_q3_3',
            question: 'Why should you avoid adding an index to every single field in a collection?',
            options: [
              'Because MongoDB crashes if you have more than 2 indexes',
              'Because every index consumes RAM and imposes write overhead on every insert, update, and delete',
              'Because indexes automatically encrypt documents',
              'Because queries can only run on Sundays'
            ],
            correctOptionIndex: 1,
            explanation: 'Indexes must be updated synchronously on write operations, so over-indexing degrades write performance and increases memory footprint.'
          }
        ],
        assignment: {
          title: 'Design Compound Index for Campus Connect Thread Feed',
          instructions: 'Specify the optimal compound index for a query that looks up posts where `status: "published"`, sorted by `createdAt: -1`, with `commentsCount: { $gt: 5 }`.',
          starterCode: `// Apply the ESR rule:
// 1. Equality: status
// 2. Sort: createdAt (-1 for descending)
// 3. Range: commentsCount

// db.posts.createIndex({
//   status: 1,
//   createdAt: -1,
//   commentsCount: 1
// });`,
          expectedOutput: 'Index definition with status first, createdAt second, and commentsCount third',
          hint: 'Sort fields must precede range filter fields to avoid in-memory sorting!'
        },
        reflectionPrompt: 'How will proper indexing impact search responsiveness in Campus Connect as thread volume scales?'
      }
    ]
  },

  // 3. Priya Sharma - Data Analyst Track
  user_member_priya: {
    memberId: 'user_member_priya',
    trackName: 'Business Intelligence & Data Analytics',
    tagline: 'Translating messy operational datasets into interactive executive dashboards with Power BI, SQL, and Excel.',
    primarySkills: ['Python', 'Excel', 'SQL', 'Power BI'],
    days: [
      {
        dayNumber: 1,
        title: 'Exploratory Data Analysis with Pandas & Clean Visuals',
        topic: 'Python & Pandas',
        learningObjective: 'Clean unstructured survey data, handle missing values, and calculate key placement distribution statistics.',
        totalTimeMinutes: 45,
        skillLevel: 'Core Foundations',
        language: 'English',
        video: {
          id: 'vmEHCJofslg',
          title: 'Pandas & Python Data Analysis Tutorial',
          channelName: 'freeCodeCamp.org',
          duration: '15:10',
          description: 'Hands-on walk-through of df.groupby, pivot tables, handling NaN values, and generating clean boxplots.',
          youtubeUrl: 'https://www.youtube.com/watch?v=vmEHCJofslg',
          thumbnailUrl: 'https://img.youtube.com/vi/vmEHCJofslg/hqdefault.jpg'
        },
        notes: {
          heading: 'Principles of Exploratory Data Analysis (EDA)',
          keyPoints: [
            'Always inspect shape, dtypes, and value_counts() before computing statistics.',
            'Use median and interquartile range (IQR) for skewed distributions like salaries rather than mean and standard deviation.',
            'Distinguish between missing completely at random (MCAR) and systematic non-reporting.'
          ],
          codeSnippet: `import pandas as pd

# Clean salary column and summarize by college branch
df['salary_lpa'] = pd.to_numeric(df['salary_raw'].str.replace('₹', '').str.replace(',', ''), errors='coerce')
branch_summary = df.groupby('branch')['salary_lpa'].agg(['count', 'median', 'mean']).round(2)`
        },
        quiz: [
          {
            id: 'pr_q1_1',
            question: 'When analyzing salary distributions with extreme high outliers, which measure of central tendency is most reliable?',
            options: [
              'Arithmetic Mean',
              'Median',
              'Standard Deviation',
              'Variance'
            ],
            correctOptionIndex: 1,
            explanation: 'The median represents the 50th percentile and is resilient to extreme outlier values, whereas the mean gets skewed heavily upwards.'
          },
          {
            id: 'pr_q1_2',
            question: 'What does df.dropna(subset=["salary"]) do in Pandas?',
            options: [
              'Deletes the entire salary column from the dataframe',
              'Drops only rows where the salary column value is NaN/missing',
              'Fills missing salaries with zeros',
              'Converts the column to integer type'
            ],
            correctOptionIndex: 1,
            explanation: 'The subset parameter limits the dropna check to specific specified columns rather than the entire row.'
          },
          {
            id: 'pr_q1_3',
            question: 'What is the Interquartile Range (IQR) used for in exploratory analysis?',
            options: [
              'To calculate the database ping latency',
              'To identify statistical outliers (Q1 - 1.5*IQR and Q3 + 1.5*IQR)',
              'To sort columns alphabetically',
              'To encrypt column names'
            ],
            correctOptionIndex: 1,
            explanation: 'IQR = Q3 - Q1, which defines the middle 50% of the dataset and provides the standard cutoff thresholds for boxplot outliers.'
          }
        ],
        assignment: {
          title: 'Calculate Branch Placement Ratios with Pandas',
          instructions: 'Write a Pandas expression to compute both the total student count and the placement rate percentage for each university department.',
          starterCode: `import pandas as pd

def compute_placement_rates(df):
    summary = df.groupby('department').agg(
        total_students=('student_id', 'count'),
        placed_students=('placed', 'sum')
    )
    summary['placement_rate_pct'] = (
        summary['placed_students'] / summary['total_students'] * 100
    ).round(1)
    return summary.sort_values(by='placement_rate_pct', ascending=False)`,
          expectedOutput: 'Clean summary table sorted by highest placement rate',
          hint: 'Named aggregation with agg(new_col=(orig_col, func)) makes your code clean and readable.'
        },
        reflectionPrompt: 'In your Placement Insights Dashboard, which department had the widest gap between mean and median package?'
      },
      {
        dayNumber: 2,
        title: 'Power BI & DAX: Building Executive Measures & Star Schemas',
        topic: 'Power BI & DAX',
        learningObjective: 'Construct star-schema relationships and write clean DAX measures using CALCULATE, FILTER, and DIVIDE with alternative results.',
        totalTimeMinutes: 45,
        skillLevel: 'Core Foundations',
        language: 'English',
        video: {
          id: 'TmhQCQr_DCA',
          title: 'Power BI Tutorial for Beginners — Full Course',
          channelName: 'Kevin Stratvert',
          duration: '15:20',
          description: 'Learn data modeling, creating star schemas, and writing basic DAX measures for executive reporting.',
          youtubeUrl: 'https://www.youtube.com/watch?v=TmhQCQr_DCA',
          thumbnailUrl: 'https://img.youtube.com/vi/TmhQCQr_DCA/hqdefault.jpg'
        },
        notes: {
          heading: 'Principles of Robust Power BI Modeling',
          keyPoints: [
            'Prefer Star Schema over flat single tables: fact table in the center surrounded by dimension tables.',
            'Never divide with the slash "/" operator in DAX; use DIVIDE(numerator, denominator, 0) to safely prevent division-by-zero crashes.',
            'CALCULATE evaluates an expression in a modified filter context; it is the most foundational function in DAX.'
          ],
          codeSnippet: `// Placement Rate DAX Measure
Placement Rate = 
DIVIDE(
    CALCULATE(COUNTROWS('FactPlacements'), 'FactPlacements'[OfferStatus] = "Accepted"),
    COUNTROWS('FactPlacements'),
    0
)`
        },
        quiz: [
          {
            id: 'pr_q2_1',
            question: 'Why is using DIVIDE() in DAX strongly preferred over the standard "/" forward-slash division?',
            options: [
              'Because DIVIDE() computes in parallel on GPUs',
              'Because DIVIDE() gracefully handles division by zero or empty values with an optional fallback result without erroring out',
              'Because "/" does not exist on Windows keyboards',
              'Because DIVIDE() works only on text strings'
            ],
            correctOptionIndex: 1,
            explanation: 'The DIVIDE function automatically intercepts zero denominators, preventing painful visual errors in front of executive stakeholders.'
          },
          {
            id: 'pr_q2_2',
            question: 'In a dimensional star schema, what is stored in the central Fact table?',
            options: [
              'Lookup codes and employee names',
              'Quantitative numerical measurements, transaction events, and foreign keys',
              'Application configuration variables',
              'Uncompressed raw text files'
            ],
            correctOptionIndex: 1,
            explanation: 'Fact tables store numerical metrics (revenue, offers, wait times) alongside foreign keys pointing to dimension tables (dates, students, departments).'
          },
          {
            id: 'pr_q2_3',
            question: 'What is the purpose of the CALCULATE function in DAX?',
            options: [
              'To solve differential equations',
              'To modify the current filter context of an expression using new filter conditions',
              'To rename columns in the Power Query editor',
              'To connect to external SQL servers'
            ],
            correctOptionIndex: 1,
            explanation: 'CALCULATE evaluates any DAX expression under modified filter rules, such as overriding dates or focusing on a specific cohort.'
          }
        ],
        assignment: {
          title: 'Write DAX Measure for YoY Offer Growth',
          instructions: 'Construct a DAX measure that calculates the percentage change in accepted job offers compared to the previous calendar year.',
          starterCode: `// YoY Placement Growth % = 
VAR CurrentYearOffers = [Total Accepted Offers]
VAR PriorYearOffers = CALCULATE([Total Accepted Offers], SAMEPERIODLASTYEAR('DimDate'[Date]))
RETURN
DIVIDE(CurrentYearOffers - PriorYearOffers, PriorYearOffers, 0)`,
          expectedOutput: 'DAX measure returning percentage growth with zero division guard',
          hint: 'Use SAMEPERIODLASTYEAR or DATEADD over a marked Date dimension table.'
        },
        reflectionPrompt: 'How does creating dedicated measure tables keep Power BI models organized as metrics grow to dozens?'
      },
      {
        dayNumber: 3,
        title: 'SQL Window Functions for Cohort Retention & Triage Queues',
        topic: 'SQL Analytics',
        learningObjective: 'Utilize ROW_NUMBER, DENSE_RANK, and LAG/LEAD to analyze wait times, repeat occurrences, and sequence intervals.',
        totalTimeMinutes: 45,
        skillLevel: 'Intermediate',
        language: 'English',
        video: {
          id: '7S_tz1z_5bA',
          title: 'SQL Joins and Window Functions Tutorial',
          channelName: 'Alex The Analyst',
          duration: '15:35',
          description: 'Step-by-step masterclass on LEAD, LAG, ROW_NUMBER, and partition intervals for operational reporting.',
          youtubeUrl: 'https://www.youtube.com/watch?v=7S_tz1z_5bA',
          thumbnailUrl: 'https://img.youtube.com/vi/7S_tz1z_5bA/hqdefault.jpg'
        },
        notes: {
          heading: 'Advanced Analytics with SQL Window Functions',
          keyPoints: [
            'Window functions do not collapse rows like GROUP BY does; each row preserves its individual identity while reading partition context.',
            'LAG(column, 1) retrieves the previous row value; LEAD(column, 1) retrieves the subsequent row value.',
            'DENSE_RANK() does not leave gaps between tied ranks, whereas RANK() leaves numerical gaps.'
          ],
          codeSnippet: `SELECT
  patient_id,
  triage_timestamp,
  doctor_seen_timestamp,
  EXTRACT(EPOCH FROM (doctor_seen_timestamp - triage_timestamp))/60 AS wait_minutes,
  AVG(EXTRACT(EPOCH FROM (doctor_seen_timestamp - triage_timestamp))/60) 
    OVER (PARTITION BY triage_priority ORDER BY triage_timestamp 
          ROWS BETWEEN 4 PRECEDING AND CURRENT ROW) AS rolling_5_avg_wait
FROM er_admissions;`
        },
        quiz: [
          {
            id: 'pr_q3_1',
            question: 'What is the main difference between ROW_NUMBER() and DENSE_RANK() in SQL?',
            options: [
              'ROW_NUMBER() always assigns unique sequential integers regardless of ties, while DENSE_RANK() gives identical numbers to tied values without skipping',
              'ROW_NUMBER() only works on text columns',
              'DENSE_RANK() only works on primary keys',
              'There is no difference'
            ],
            correctOptionIndex: 0,
            explanation: 'ROW_NUMBER() breaks ties arbitrarily to give strict 1,2,3... while DENSE_RANK() handles ties cleanly (1, 1, 2, 3).'
          },
          {
            id: 'pr_q3_2',
            question: 'Which window function allows you to compare a student\'s current exam score with their immediately previous exam score without a self-join?',
            options: ['LAG()', 'LEAD()', 'NTILE()', 'FIRST_VALUE()'],
            correctOptionIndex: 0,
            explanation: 'LAG(score, 1) looks backward 1 row within the ordered partition.'
          },
          {
            id: 'pr_q3_3',
            question: 'Can you use a window function inside a WHERE clause directly (e.g. WHERE ROW_NUMBER() = 1)?',
            options: [
              'Yes, anytime',
              'No, window functions evaluate after WHERE; you must wrap the query in a Common Table Expression (CTE) or subquery',
              'Only on Microsoft SQL Server',
              'Only if you have an admin license'
            ],
            correctOptionIndex: 1,
            explanation: 'Because window functions evaluate after WHERE and HAVING filtering stages, filtering on a window result requires a CTE (WITH ranked AS (...)) or subquery.'
          }
        ],
        assignment: {
          title: 'Calculate Emergency Room Bottlenecks by Shift',
          instructions: 'Write an SQL query using LAG to calculate the time gap (in minutes) between consecutive patient admissions during peak shifts.',
          starterCode: `WITH AdmissionGaps AS (
  SELECT
    admission_id,
    shift_name,
    admission_time,
    LAG(admission_time) OVER (PARTITION BY shift_name ORDER BY admission_time) AS prev_admission_time
  FROM emergency_intake
)
SELECT
  shift_name,
  ROUND(AVG(EXTRACT(EPOCH FROM (admission_time - prev_admission_time))/60), 1) AS avg_intake_gap_mins
FROM AdmissionGaps
WHERE prev_admission_time IS NOT NULL
GROUP BY shift_name;`,
          expectedOutput: 'Table showing average intake spacing across shifts in minutes',
          hint: 'Remember to filter out the initial null row where LAG has no previous row.'
        },
        reflectionPrompt: 'How did discovering shift-to-shift gaps clarify the 38-minute triage bottleneck in your hospital case study?'
      }
    ]
  }
};
