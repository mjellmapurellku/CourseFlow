using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;


namespace CourseFlow.backend.Models
{
    public class Lesson
    {
        public int Id { get; set; }

        public int CourseId { get; set; }
        [JsonIgnore]
        public Course? Course { get; set; }

        public string Title { get; set; }
        public string Description { get; set; }

        public string VideoUrl { get; set; } 

        public int Order { get; set; } 
        public bool IsCompleted { get; set; }
        public bool IsFree { get; set; } = false;
    }
}
