/**
 * Production-Ready Content Creation for NovaAI University
 * Creates comprehensive educational platform with rich learning materials
 */

import fs from 'fs';

// Production-ready course structure with full content
const productionCourses = [
  {
    title: "Foundations of Artificial Intelligence",
    slug: "ai-foundations-complete",
    description: "Comprehensive introduction to AI concepts, algorithms, and real-world applications",
    difficulty: "beginner",
    duration: "8 weeks",
    estimatedHours: 40,
    prerequisites: "Basic programming knowledge",
    tags: ["artificial-intelligence", "machine-learning", "fundamentals", "python"],
    learningOutcomes: [
      "Understand core AI concepts and terminology",
      "Implement basic ML algorithms from scratch",
      "Apply AI solutions to real-world problems",
      "Evaluate AI system performance and limitations"
    ],
    modules: [
      {
        title: "Introduction to Artificial Intelligence",
        description: "History, definitions, and scope of AI",
        orderIndex: 1,
        estimatedDuration: "1 week",
        lessons: [
          {
            title: "What is Artificial Intelligence?",
            type: "text",
            duration: 45,
            content: `# What is Artificial Intelligence?

## Defining Artificial Intelligence

Artificial Intelligence (AI) is the simulation of human intelligence in machines that are programmed to think and learn like humans. The term encompasses any machine that exhibits traits associated with human cognitive functions such as learning, reasoning, problem-solving, perception, and language understanding.

## Key Characteristics of AI Systems

### 1. Learning
AI systems can improve their performance through experience without being explicitly programmed for every scenario.

### 2. Reasoning
The ability to draw conclusions from available information and make logical deductions.

### 3. Problem Solving
AI can identify problems and develop solutions through systematic approaches.

### 4. Perception
Understanding and interpreting sensory data from the environment.

### 5. Natural Language Processing
The ability to understand, interpret, and generate human language.

## Types of Artificial Intelligence

### Narrow AI (Weak AI)
- **Current Reality**: All existing AI systems
- **Characteristics**: Designed for specific tasks
- **Examples**: 
  - Image recognition systems
  - Chess-playing programs
  - Voice assistants (Siri, Alexa)
  - Recommendation engines

### General AI (Strong AI)
- **Future Goal**: AI with human-level cognitive abilities
- **Characteristics**: Can understand, learn, and apply knowledge across different domains
- **Current Status**: Theoretical, not yet achieved

### Superintelligence
- **Hypothetical**: AI that surpasses human intelligence in all aspects
- **Timeline**: Uncertain, subject of ongoing debate
- **Implications**: Significant societal and ethical considerations

## AI vs Related Fields

### Machine Learning
- **Relationship**: Subset of AI
- **Focus**: Algorithms that improve through experience
- **Key Difference**: ML is the method, AI is the goal

### Deep Learning
- **Relationship**: Subset of Machine Learning
- **Focus**: Neural networks with multiple layers
- **Applications**: Image recognition, natural language processing

### Data Science
- **Relationship**: Overlapping field
- **Focus**: Extracting insights from data
- **Tools**: Statistics, ML, domain expertise

## Real-World Applications

### Healthcare
- **Medical Imaging**: AI detects tumors, fractures, and diseases in X-rays, MRIs, and CT scans
- **Drug Discovery**: Accelerating the development of new medications
- **Personalized Treatment**: Tailoring medical treatments to individual patients

### Transportation
- **Autonomous Vehicles**: Self-driving cars and trucks
- **Traffic Optimization**: Reducing congestion through intelligent routing
- **Predictive Maintenance**: Preventing vehicle breakdowns

### Finance
- **Fraud Detection**: Identifying suspicious transactions in real-time
- **Algorithmic Trading**: Automated investment decisions
- **Credit Scoring**: Assessing loan default risk

### Technology
- **Search Engines**: Ranking and retrieving relevant information
- **Voice Assistants**: Understanding and responding to spoken commands
- **Language Translation**: Real-time translation between languages

## The AI Landscape Today

### Major Players
- **Tech Giants**: Google, Microsoft, Amazon, Apple, Meta
- **AI-First Companies**: OpenAI, Anthropic, DeepMind
- **Traditional Industries**: Adopting AI across sectors

### Current Capabilities
- **Language Models**: GPT-4, Claude, Gemini
- **Computer Vision**: Object detection, facial recognition
- **Robotics**: Industrial automation, service robots
- **Game Playing**: Superhuman performance in chess, Go, poker

### Limitations
- **Lack of General Intelligence**: Current AI is task-specific
- **Data Dependency**: Requires large amounts of training data
- **Interpretability**: "Black box" decision-making
- **Bias and Fairness**: Can perpetuate societal biases

## Ethical Considerations

### Privacy
- Data collection and usage concerns
- Consent and transparency requirements

### Bias and Fairness
- Ensuring AI systems treat all groups equitably
- Addressing historical biases in training data

### Job Displacement
- Automation's impact on employment
- Need for reskilling and adaptation

### Safety and Security
- Ensuring AI systems behave as intended
- Protecting against malicious use

## The Future of AI

### Near-term (1-5 years)
- Continued improvement in language models
- Broader adoption across industries
- Better integration with existing systems

### Medium-term (5-15 years)
- More sophisticated autonomous systems
- Breakthrough in robotics and embodied AI
- Enhanced human-AI collaboration

### Long-term (15+ years)
- Potential development of AGI
- Fundamental changes in society and economy
- Need for new governance frameworks

## Getting Started with AI

### Essential Skills
1. **Programming**: Python, R, or similar languages
2. **Mathematics**: Statistics, linear algebra, calculus
3. **Data Analysis**: Understanding and manipulating datasets
4. **Domain Knowledge**: Understanding the problem you're solving

### Learning Path
1. **Foundations**: Learn programming and statistics
2. **Theory**: Study ML algorithms and concepts
3. **Practice**: Work on real projects and datasets
4. **Specialization**: Focus on specific AI domains
5. **Ethics**: Understand responsible AI development

## Conclusion

AI represents one of the most significant technological advances of our time. While current AI systems are narrow in scope, they're already transforming industries and daily life. Understanding AI's capabilities, limitations, and implications is crucial for anyone living in the modern world.

As we continue to develop more sophisticated AI systems, the need for responsible development, ethical considerations, and human-centered design becomes increasingly important. The future of AI will largely depend on how well we can harness its power while addressing its challenges.

## Key Takeaways

1. AI is about creating machines that can perform tasks requiring human intelligence
2. Current AI is "narrow" - designed for specific tasks
3. AI applications are already widespread across industries
4. Ethical considerations are crucial for responsible AI development
5. Learning AI requires a combination of technical and domain expertise

In the next lesson, we'll explore the fascinating history of artificial intelligence and how we arrived at today's capabilities.`
          },
          {
            title: "History and Evolution of AI",
            type: "interactive",
            duration: 60,
            content: `# History and Evolution of AI

## The Birth of AI (1940s-1950s)

### Theoretical Foundations

The concept of artificial intelligence emerged from the convergence of several fields: mathematics, logic, philosophy, and the newly developing field of computer science.

#### Key Pioneers

**Alan Turing (1912-1954)**
- **1936**: Developed the concept of the Turing Machine
- **1950**: Published "Computing Machinery and Intelligence"
- **The Turing Test**: A test of machine intelligence based on conversation

**Warren McCulloch and Walter Pitts (1943)**
- Created the first mathematical model of neural networks
- Showed that simple neural networks could compute any logical function

**John von Neumann (1903-1957)**
- Developed the stored-program computer architecture
- Contributed to game theory and computational mathematics

### The Dartmouth Conference (1956)

The term "Artificial Intelligence" was coined at the Dartmouth Summer Research Project on Artificial Intelligence in 1956.

**Organizers**: John McCarthy, Marvin Minsky, Nathaniel Rochester, Claude Shannon

**Proposal**: "Every aspect of learning or any other feature of intelligence can in principle be so precisely described that a machine can be made to simulate it."

## The Early Years (1950s-1960s)

### First AI Programs

**Logic Theorist (1955)**
- Created by Allen Newell and Herbert Simon
- Proved mathematical theorems
- Considered the first AI program

**General Problem Solver (GPS) (1957)**
- Also by Newell and Simon
- Could solve a variety of problems using means-ends analysis

### Early Successes

**Checkers Program (1952)**
- Arthur Samuel's checkers-playing program
- Could learn and improve its play over time
- Beat human champions

**ELIZA (1964-1966)**
- Joseph Weizenbaum's chatbot
- Simulated a Rogerian psychotherapist
- Demonstrated the ELIZA effect (humans attributing intelligence to simple programs)

## The First AI Winter (Late 1960s-1970s)

### Challenges and Limitations

Despite early enthusiasm, AI research faced significant obstacles:

1. **Computational Limitations**: Computers were too slow and had limited memory
2. **Complexity Underestimated**: Problems turned out to be much harder than expected
3. **Funding Cuts**: Government funding was reduced due to lack of progress

### The Lighthill Report (1973)

British mathematician James Lighthill published a critical report on AI research, leading to significant funding cuts in the UK.

## Knowledge-Based Systems (1970s-1980s)

### Expert Systems Revolution

The focus shifted from general problem-solving to domain-specific knowledge systems.

**DENDRAL (Early 1970s)**
- Analyzed mass spectrometry data
- First successful expert system

**MYCIN (Mid-1970s)**
- Diagnosed bacterial infections
- Recommended antibiotic treatments
- Performed at the level of human experts

### Key Innovations

1. **Knowledge Representation**: How to store and organize knowledge
2. **Inference Engines**: How to reason with stored knowledge
3. **Rule-Based Systems**: If-then rules for decision making

## The Second AI Winter (Late 1980s-Early 1990s)

### Market Collapse

- Expert system market crashed due to:
  - High maintenance costs
  - Difficulty in scaling
  - Competition from cheaper alternatives

### Funding Reduction

- Research funding decreased again
- Many AI companies failed

## The Renaissance (1990s-2000s)

### New Approaches

**Statistical Methods**
- Move away from symbolic AI to statistical approaches
- Machine learning gained prominence

**Internet and Data**
- Vast amounts of data became available
- Computational power increased dramatically

### Breakthrough Applications

**Deep Blue (1997)**
- IBM's chess computer
- Defeated world champion Garry Kasparov
- Demonstrated AI's potential in complex games

**DARPA Grand Challenge (2004-2007)**
- Autonomous vehicle competitions
- Sparked interest in self-driving cars

## The Machine Learning Era (2000s-2010s)

### Key Developments

**Support Vector Machines**
- Effective for classification and regression
- Mathematical foundation for learning theory

**Random Forests and Ensemble Methods**
- Combining multiple models for better performance

**Rise of Big Data**
- Hadoop and distributed computing
- Ability to process massive datasets

### Web-Scale Applications

**Google Search**
- PageRank algorithm revolutionized web search
- Demonstrated AI's commercial value

**Recommendation Systems**
- Amazon, Netflix personalization
- Collaborative filtering techniques

## The Deep Learning Revolution (2010s-Present)

### The ImageNet Moment (2012)

**AlexNet**
- Convolutional Neural Network by Alex Krizhevsky
- Won ImageNet competition with 85% accuracy
- Sparked the deep learning revolution

### Breakthrough Technologies

**Convolutional Neural Networks (CNNs)**
- Revolutionized computer vision
- Applications: medical imaging, autonomous vehicles

**Recurrent Neural Networks (RNNs) and LSTMs**
- Advanced natural language processing
- Machine translation, speech recognition

**Generative Adversarial Networks (GANs) (2014)**
- Ian Goodfellow's innovation
- Ability to generate realistic images and data

### Transformers and Attention (2017)**

**"Attention Is All You Need" Paper**
- Introduced the Transformer architecture
- Foundation for modern language models

### Language Model Revolution

**BERT (2018)**
- Bidirectional Encoder Representations from Transformers
- Advanced understanding of context in language

**GPT Series (2018-2023)**
- GPT-1 (2018): 117M parameters
- GPT-2 (2019): 1.5B parameters
- GPT-3 (2020): 175B parameters
- GPT-4 (2023): Multimodal capabilities

**ChatGPT (2022)**
- Brought AI to mainstream consciousness
- Demonstrated conversational AI capabilities

## Current State and Future Directions

### Major Achievements

1. **Language Understanding**: Near-human performance in many NLP tasks
2. **Computer Vision**: Superhuman accuracy in image classification
3. **Game Playing**: Mastery of complex games (Go, StarCraft II, poker)
4. **Scientific Discovery**: Protein folding (AlphaFold), drug discovery

### Emerging Trends

**Multimodal AI**
- Systems that understand text, images, audio, and video
- Examples: GPT-4V, DALL-E, Midjourney

**Large Language Models (LLMs)**
- Scaling to trillions of parameters
- Emergent capabilities at scale

**AI Safety and Alignment**
- Ensuring AI systems behave as intended
- Research into interpretability and control

**Artificial General Intelligence (AGI)**
- Goal of human-level AI across all domains
- Timeline remains uncertain and debated

### Current Challenges

1. **Computational Requirements**: Massive energy and computing needs
2. **Data Quality and Bias**: Ensuring fair and accurate training data
3. **Interpretability**: Understanding how AI systems make decisions
4. **Safety and Control**: Preventing misuse and unintended consequences

## Timeline Summary

| Period | Key Developments | Notable Systems |
|--------|------------------|-----------------|
| 1940s-1950s | Theoretical foundations | Turing Test, Neural networks |
| 1950s-1960s | First AI programs | Logic Theorist, ELIZA |
| 1970s-1980s | Expert systems | MYCIN, DENDRAL |
| 1990s-2000s | Statistical methods | Deep Blue, Web search |
| 2000s-2010s | Machine learning | Big data, SVMs |
| 2010s-Present | Deep learning | AlexNet, GPT, ChatGPT |

## Interactive Exercise

**Discussion Questions:**

1. What factors contributed to the AI winters, and how were they overcome?
2. How has the availability of data and computing power shaped AI development?
3. What ethical considerations have become more important as AI has advanced?
4. How might the current AI boom be different from previous cycles?

**Timeline Activity:**
Create a personal timeline of AI developments that have impacted your life. Consider:
- Search engines you've used
- Recommendation systems (Netflix, Amazon)
- Voice assistants
- Social media algorithms
- Navigation systems

## Looking Forward

Understanding AI's history helps us appreciate both its potential and its challenges. As we stand at the threshold of potentially achieving AGI, the lessons from AI's past can guide us toward a future where artificial intelligence benefits all of humanity.

The journey from simple logic programs to sophisticated language models shows us that AI development is not linear but consists of breakthroughs, setbacks, and paradigm shifts. As we continue to push the boundaries of what's possible, understanding this history becomes crucial for both practitioners and citizens in our AI-driven world.

## Key Takeaways

1. AI development has been cyclical, with periods of excitement followed by "winters"
2. Each era was characterized by different approaches and breakthrough technologies
3. Computational power and data availability have been crucial enablers
4. Current AI capabilities result from decades of accumulated knowledge and innovation
5. Understanding history helps us navigate future challenges and opportunities

In our next lesson, we'll explore the mathematical foundations that make modern AI possible.`
          }
        ]
      },
      {
        title: "Machine Learning Fundamentals",
        description: "Core concepts and algorithms in machine learning",
        orderIndex: 2,
        estimatedDuration: "2 weeks",
        lessons: [
          {
            title: "Types of Machine Learning",
            type: "text",
            duration: 50,
            content: `# Types of Machine Learning

Machine learning algorithms can be categorized into several types based on how they learn from data and the nature of the problems they solve. Understanding these categories is crucial for selecting the right approach for your specific problem.

## 1. Supervised Learning

Supervised learning is like learning with a teacher. The algorithm learns from labeled examples, where both input and correct output are provided.

### Characteristics
- **Training Data**: Includes both features (input) and labels (correct output)
- **Goal**: Learn a mapping function from input to output
- **Evaluation**: Performance measured on new, unseen data

### Types of Supervised Learning

#### Classification
Predicting discrete categories or classes.

**Examples:**
- Email spam detection (spam vs. not spam)
- Image recognition (cat, dog, bird)
- Medical diagnosis (disease vs. healthy)
- Sentiment analysis (positive, negative, neutral)

**Common Algorithms:**
- Logistic Regression
- Decision Trees
- Random Forest
- Support Vector Machines (SVM)
- Neural Networks

#### Regression
Predicting continuous numerical values.

**Examples:**
- House price prediction
- Stock market forecasting
- Temperature prediction
- Sales revenue estimation

**Common Algorithms:**
- Linear Regression
- Polynomial Regression
- Ridge and Lasso Regression
- Random Forest Regressor
- Neural Networks

### Supervised Learning Process

1. **Data Collection**: Gather labeled training data
2. **Feature Engineering**: Select and prepare input features
3. **Model Training**: Algorithm learns from training data
4. **Validation**: Test model on validation set
5. **Evaluation**: Assess performance on test set
6. **Deployment**: Use model to make predictions on new data

## 2. Unsupervised Learning

Unsupervised learning is like learning without a teacher. The algorithm finds hidden patterns in data without labeled examples.

### Characteristics
- **Training Data**: Only input features, no labels
- **Goal**: Discover hidden structure in data
- **Evaluation**: Often subjective or domain-specific

### Types of Unsupervised Learning

#### Clustering
Grouping similar data points together.

**Applications:**
- Customer segmentation
- Gene sequencing
- Image segmentation
- Market research

**Common Algorithms:**
- K-Means
- Hierarchical Clustering
- DBSCAN
- Gaussian Mixture Models

**Example: Customer Segmentation**
```python
from sklearn.cluster import KMeans
import numpy as np

# Customer data: [age, income]
customers = np.array([[25, 40000], [30, 50000], [35, 60000], 
                     [45, 80000], [50, 90000], [55, 100000]])

# Cluster customers into 2 groups
kmeans = KMeans(n_clusters=2)
clusters = kmeans.fit_predict(customers)
print(f"Customer clusters: {clusters}")
```

#### Dimensionality Reduction
Reducing the number of features while preserving important information.

**Applications:**
- Data visualization
- Noise reduction
- Feature selection
- Compression

**Common Algorithms:**
- Principal Component Analysis (PCA)
- t-SNE
- Linear Discriminant Analysis (LDA)
- Autoencoders

#### Association Rule Learning
Finding relationships between different variables.

**Applications:**
- Market basket analysis
- Recommendation systems
- Web usage patterns

**Common Algorithms:**
- Apriori
- FP-Growth

**Example: Market Basket Analysis**
"People who buy bread and milk also tend to buy eggs"

#### Anomaly Detection
Identifying unusual patterns or outliers in data.

**Applications:**
- Fraud detection
- Network security
- Quality control
- Medical diagnosis

**Common Algorithms:**
- Isolation Forest
- One-Class SVM
- Local Outlier Factor

## 3. Semi-Supervised Learning

Semi-supervised learning combines labeled and unlabeled data, typically using a small amount of labeled data with a large amount of unlabeled data.

### Characteristics
- **Training Data**: Mix of labeled and unlabeled examples
- **Goal**: Leverage unlabeled data to improve performance
- **Use Case**: When labeling is expensive or time-consuming

### Applications
- Text classification with limited labeled documents
- Image classification with few labeled images
- Speech recognition with limited transcribed audio

### Common Approaches
- **Self-training**: Use model's own predictions as labels
- **Co-training**: Train multiple models on different feature sets
- **Graph-based methods**: Propagate labels through data similarity graphs

## 4. Reinforcement Learning

Reinforcement learning is like learning through trial and error, with rewards and punishments guiding the learning process.

### Characteristics
- **No labeled data**: Agent learns through interaction
- **Feedback**: Rewards and penalties for actions
- **Goal**: Maximize cumulative reward over time

### Key Components

#### Agent
The learning entity that takes actions.

#### Environment
The world in which the agent operates.

#### State
Current situation of the agent.

#### Action
What the agent can do in each state.

#### Reward
Feedback signal indicating the quality of an action.

#### Policy
Strategy that defines the agent's behavior.

### Applications
- Game playing (Chess, Go, video games)
- Autonomous vehicles
- Robotics
- Trading algorithms
- Resource allocation
- Personalized recommendations

### Famous Examples

**AlphaGo (2016)**
- Defeated world champion Lee Sedol in Go
- Combined deep learning with reinforcement learning

**OpenAI Five (2018)**
- Mastered the complex video game Dota 2
- Demonstrated coordination and strategy

**AlphaStar (2019)**
- Achieved Grandmaster level in StarCraft II
- Real-time strategy with incomplete information

### Reinforcement Learning Process

1. **Agent observes current state**
2. **Agent selects action based on policy**
3. **Environment responds with new state and reward**
4. **Agent updates policy based on experience**
5. **Repeat until optimal policy is learned**

## 5. Deep Learning

Deep learning is a subset of machine learning that uses neural networks with multiple layers (hence "deep") to model complex patterns.

### Characteristics
- **Architecture**: Neural networks with many hidden layers
- **Automatic Feature Learning**: No manual feature engineering
- **Large Data Requirements**: Typically needs lots of training data
- **Computational Intensive**: Requires significant processing power

### Types of Deep Learning

#### Feedforward Neural Networks
Information flows in one direction from input to output.

#### Convolutional Neural Networks (CNNs)
Specialized for processing grid-like data such as images.

**Applications:**
- Image classification
- Object detection
- Medical imaging
- Autonomous vehicles

#### Recurrent Neural Networks (RNNs)
Designed for sequential data with memory of previous inputs.

**Applications:**
- Natural language processing
- Speech recognition
- Time series prediction
- Machine translation

#### Generative Adversarial Networks (GANs)
Two networks competing against each other to generate realistic data.

**Applications:**
- Image generation
- Style transfer
- Data augmentation
- Creative applications

## 6. Online Learning

Online learning algorithms update the model incrementally as new data arrives, rather than training on the entire dataset at once.

### Characteristics
- **Incremental Updates**: Model learns from one example at a time
- **Memory Efficient**: Doesn't need to store entire dataset
- **Adaptive**: Can handle changing data distributions

### Applications
- Streaming data processing
- Real-time recommendation systems
- Fraud detection
- A/B testing

## 7. Transfer Learning

Transfer learning leverages knowledge gained from one task to improve performance on a related task.

### Characteristics
- **Pre-trained Models**: Start with model trained on large dataset
- **Fine-tuning**: Adapt model to specific task
- **Efficiency**: Requires less data and training time

### Applications
- Image classification with pre-trained CNNs
- Natural language processing with pre-trained language models
- Medical imaging with models trained on general images

## Choosing the Right Type

The choice of machine learning type depends on several factors:

### Available Data
- **Labeled data available**: Supervised learning
- **Only unlabeled data**: Unsupervised learning
- **Mixed labeled/unlabeled**: Semi-supervised learning
- **No historical data**: Reinforcement learning

### Problem Type
- **Prediction with known categories**: Classification
- **Prediction of continuous values**: Regression
- **Finding patterns**: Clustering
- **Sequential decision making**: Reinforcement learning

### Computational Resources
- **Limited compute**: Simple algorithms (linear models, k-means)
- **High compute available**: Deep learning, ensemble methods

### Interpretability Requirements
- **High interpretability needed**: Decision trees, linear models
- **Performance over interpretability**: Deep learning, ensemble methods

## Practical Example: Choosing ML Type

**Problem**: Predict customer churn for a subscription service

**Available Data**: 
- Customer demographics
- Usage patterns
- Subscription history
- Churn labels (churned/not churned)

**Analysis**:
- We have labeled data → Supervised Learning
- Binary outcome → Classification
- Goal is prediction → Supervised Classification

**Suitable Algorithms**:
- Logistic Regression (interpretable)
- Random Forest (good performance)
- Neural Networks (high accuracy)

## Summary Comparison

| Type | Data | Goal | Examples |
|------|------|------|----------|
| Supervised | Labeled | Predict target | Classification, Regression |
| Unsupervised | Unlabeled | Find patterns | Clustering, Dimensionality reduction |
| Semi-supervised | Mixed | Improve with unlabeled data | Text classification, Image recognition |
| Reinforcement | Rewards/penalties | Optimize actions | Game playing, Robotics |
| Deep Learning | Large datasets | Complex patterns | Image recognition, NLP |

## Key Takeaways

1. **Supervised learning** is best when you have labeled data and want to make predictions
2. **Unsupervised learning** helps discover hidden patterns in unlabeled data
3. **Reinforcement learning** is ideal for sequential decision-making problems
4. **Deep learning** excels with large datasets and complex patterns
5. The choice depends on your data, problem type, and constraints

Understanding these different types of machine learning is fundamental to becoming an effective AI practitioner. In the next lesson, we'll dive deeper into the data that powers these algorithms.`
          }
        ]
      }
    ]
  }
];

// Create comprehensive content files
const contentStructure = {
  meta: {
    platform: "NovaAI University",
    version: "2.0.0",
    created: new Date().toISOString(),
    content_type: "production_ready",
    total_courses: productionCourses.length,
    estimated_content_hours: productionCourses.reduce((sum, course) => sum + course.estimatedHours, 0)
  },
  courses: productionCourses
};

// Write comprehensive content
fs.writeFileSync('production-content.json', JSON.stringify(contentStructure, null, 2));

// Create SQL insertion script for database
const createInsertScript = () => {
  let script = `-- NovaAI University Production Content
-- Generated: ${new Date().toISOString()}

BEGIN;

-- Clear existing data
TRUNCATE TABLE lesson_progress, lessons, course_modules, courses RESTART IDENTITY CASCADE;

`;

// Insert courses
productionCourses.forEach((course, courseIndex) => {
  script += `
-- Course ${courseIndex + 1}: ${course.title}
INSERT INTO courses (
  title, slug, description, difficulty, duration, tags, 
  estimated_hours, prerequisites, learning_outcomes, created_at, updated_at
) VALUES (
  '${course.title.replace(/'/g, "''")}',
  '${course.slug}',
  '${course.description.replace(/'/g, "''")}',
  '${course.difficulty}',
  '${course.duration}',
  '{${course.tags.join(',')}}',
  ${course.estimatedHours},
  '${course.prerequisites}',
  '{${course.learningOutcomes.map(outcome => outcome.replace(/'/g, "''")).join('","')}}',
  NOW(),
  NOW()
);

`;

  // Insert modules for this course
  course.modules.forEach((module, moduleIndex) => {
    script += `
-- Module ${moduleIndex + 1}: ${module.title}
INSERT INTO course_modules (
  course_id, title, description, order_index, estimated_duration, created_at, updated_at
) VALUES (
  (SELECT id FROM courses WHERE slug = '${course.slug}'),
  '${module.title.replace(/'/g, "''")}',
  '${module.description.replace(/'/g, "''")}',
  ${module.orderIndex},
  '${module.estimatedDuration}',
  NOW(),
  NOW()
);

`;

    // Insert lessons for this module
    module.lessons.forEach((lesson, lessonIndex) => {
      const contentEscaped = lesson.content.replace(/'/g, "''").replace(/\$/g, '$$');
      script += `
-- Lesson ${lessonIndex + 1}: ${lesson.title}
INSERT INTO lessons (
  module_id, title, type, duration, content, order_index, created_at, updated_at
) VALUES (
  (SELECT id FROM course_modules WHERE title = '${module.title.replace(/'/g, "''")}' 
   AND course_id = (SELECT id FROM courses WHERE slug = '${course.slug}')),
  '${lesson.title.replace(/'/g, "''")}',
  '${lesson.type}',
  ${lesson.duration},
  '${contentEscaped}',
  ${lessonIndex + 1},
  NOW(),
  NOW()
);

`;
    });
  });
});

script += `
COMMIT;

-- Verify insertion
SELECT 
  c.title as course_title,
  COUNT(DISTINCT m.id) as modules_count,
  COUNT(l.id) as lessons_count,
  SUM(l.duration) as total_duration_minutes
FROM courses c
LEFT JOIN course_modules m ON c.id = m.course_id
LEFT JOIN lessons l ON m.id = l.module_id
GROUP BY c.id, c.title
ORDER BY c.id;
`;

  return script;
};

fs.writeFileSync('production-content-insert.sql', createInsertScript());

console.log('✅ Production-ready content created successfully!');
console.log(`📚 Created ${productionCourses.length} comprehensive courses`);
console.log(`⏱️ Total estimated content: ${contentStructure.meta.estimated_content_hours} hours`);
console.log('📁 Files created:');
console.log('  - production-content.json (Content structure)');
console.log('  - production-content-insert.sql (Database insertion script)');
console.log('🎯 Content is now ready for production deployment!');