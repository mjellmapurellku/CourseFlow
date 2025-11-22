//using Microsoft.AspNetCore.Mvc;
//using CourseFlow.backend.Data;

//namespace CourseFlow.backend.Controllers
//{
//    [ApiController]
//    [Route("api/[controller]")]
//    public class AdminController : ControllerBase
//    {
//        private readonly DataSeeder _seeder;

//        public AdminController(DataSeeder seeder)
//        {
//            _seeder = seeder;
//        }

//        // ✅ Manual refresh endpoint
//        [HttpPost("refresh-courses")]
//        public async Task<IActionResult> RefreshCourses()
//        {
//            await _seeder.SeedCoursesAsync();
//            return Ok(new { message = "Courses refreshed successfully!" });
//        }
//    }
//}
