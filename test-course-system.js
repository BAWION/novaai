/**
 * Test script for comprehensive course management system
 * Validates Python Basics course creation and progress tracking
 */

const BASE_URL = "https://49c11d52-b1fc-4151-bb61-b9097616c44f-00-3h2ne9cwwtbvn.janeway.replit.dev";

async function makeRequest(method, path, data = null, cookies = '') {
  const url = `${BASE_URL}${path}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookies
    }
  };
  
  if (data) {
    options.body = JSON.stringify(data);
  }
  
  const response = await fetch(url, options);
  const result = await response.text();
  
  return {
    status: response.status,
    headers: response.headers,
    body: result,
    cookies: response.headers.get('set-cookie') || ''
  };
}

function extractCookies(response) {
  const setCookie = response.cookies;
  if (setCookie) {
    return setCookie.split(';')[0];
  }
  return '';
}

async function testCourseManagementSystem() {
  console.log('=== Testing Course Management System ===');
  
  try {
    // Step 1: Login as Vitaliy (test user)
    console.log('\n1. Logging in as test user...');
    const loginResponse = await makeRequest('POST', '/api/auth/login', {
      username: 'Vitaliy',
      password: '500500В'
    });
    
    console.log(`Login status: ${loginResponse.status}`);
    
    if (loginResponse.status !== 200) {
      console.log('Login failed, response:', loginResponse.body);
      return;
    }
    
    const cookies = extractCookies(loginResponse);
    console.log('Login successful, session established');
    
    // Step 2: Check course templates
    console.log('\n2. Fetching available course templates...');
    const templatesResponse = await makeRequest('GET', '/api/course-init/templates', null, cookies);
    console.log(`Templates status: ${templatesResponse.status}`);
    console.log('Templates:', templatesResponse.body);
    
    // Step 3: Create Python Basics course
    console.log('\n3. Creating Python Basics course...');
    const createCourseResponse = await makeRequest('POST', '/api/course-init/python-basics', {}, cookies);
    console.log(`Course creation status: ${createCourseResponse.status}`);
    console.log('Course creation response:', createCourseResponse.body);
    
    // Step 4: Fetch all courses
    console.log('\n4. Fetching all courses...');
    const coursesResponse = await makeRequest('GET', '/api/courses', null, cookies);
    console.log(`Courses status: ${coursesResponse.status}`);
    
    if (coursesResponse.status === 200) {
      const courses = JSON.parse(coursesResponse.body);
      console.log(`Found ${courses.length} courses`);
      
      // Find Python Basics course
      const pythonCourse = courses.find(course => course.slug === 'python-basics');
      if (pythonCourse) {
        console.log('Python Basics course found:', {
          id: pythonCourse.id,
          title: pythonCourse.title,
          modules: pythonCourse.modules,
          difficulty: pythonCourse.difficulty
        });
        
        // Step 5: Get detailed course content
        console.log('\n5. Fetching detailed course content...');
        const courseContentResponse = await makeRequest('GET', `/api/course-management/course/${pythonCourse.id}`, null, cookies);
        console.log(`Course content status: ${courseContentResponse.status}`);
        
        if (courseContentResponse.status === 200) {
          const courseContent = JSON.parse(courseContentResponse.body);
          if (courseContent.success && courseContent.course) {
            console.log('Course content details:', {
              modules: courseContent.course.modules?.length || 0,
              totalLessons: courseContent.course.modules?.reduce((acc, mod) => acc + (mod.lessons?.length || 0), 0) || 0,
              objectives: courseContent.course.objectives?.length || 0
            });
            
            // Step 6: Start the course
            console.log('\n6. Starting course enrollment...');
            const startCourseResponse = await makeRequest('POST', `/api/course-management/start/${pythonCourse.id}`, {}, cookies);
            console.log(`Start course status: ${startCourseResponse.status}`);
            console.log('Start course response:', startCourseResponse.body);
            
            // Step 7: Check course progress
            console.log('\n7. Checking course progress...');
            const progressResponse = await makeRequest('GET', `/api/course-management/progress/${pythonCourse.id}`, null, cookies);
            console.log(`Progress status: ${progressResponse.status}`);
            console.log('Progress response:', progressResponse.body);
            
            if (progressResponse.status === 200) {
              const progressData = JSON.parse(progressResponse.body);
              if (progressData.success && progressData.progress) {
                console.log('Course progress:', {
                  overallProgress: progressData.progress.overallProgress,
                  completedLessons: progressData.progress.completedLessons,
                  totalLessons: progressData.progress.totalLessons,
                  estimatedTimeRemaining: progressData.progress.estimatedTimeRemaining
                });
              }
            }
            
            // Step 8: Simulate lesson completion
            if (courseContent.course.modules?.[0]?.lessons?.[0]) {
              const firstLesson = courseContent.course.modules[0].lessons[0];
              console.log(`\n8. Completing first lesson: ${firstLesson.title}...`);
              
              const completeLessonResponse = await makeRequest('POST', `/api/course-management/complete-lesson/${firstLesson.id}`, {}, cookies);
              console.log(`Complete lesson status: ${completeLessonResponse.status}`);
              console.log('Complete lesson response:', completeLessonResponse.body);
              
              // Check updated progress
              console.log('\n9. Checking updated progress after lesson completion...');
              const updatedProgressResponse = await makeRequest('GET', `/api/course-management/progress/${pythonCourse.id}`, null, cookies);
              console.log(`Updated progress status: ${updatedProgressResponse.status}`);
              
              if (updatedProgressResponse.status === 200) {
                const updatedProgressData = JSON.parse(updatedProgressResponse.body);
                if (updatedProgressData.success && updatedProgressData.progress) {
                  console.log('Updated course progress:', {
                    overallProgress: updatedProgressData.progress.overallProgress,
                    completedLessons: updatedProgressData.progress.completedLessons,
                    totalLessons: updatedProgressData.progress.totalLessons
                  });
                }
              }
            }
          }
        }
      } else {
        console.log('Python Basics course not found in courses list');
      }
    }
    
    console.log('\n=== Course Management System Test Complete ===');
    
  } catch (error) {
    console.error('Test failed with error:', error);
  }
}

// Run the test
testCourseManagementSystem();