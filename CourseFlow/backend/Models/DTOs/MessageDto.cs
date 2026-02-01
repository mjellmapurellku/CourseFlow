using System.Text.Json.Serialization;

namespace CourseFlow.backend.Models.DTOs
{
    public class MessageDto
    {
        [JsonPropertyName("role")]
        public string Role { get; set; }

        [JsonPropertyName("content")]
        public string Content { get; set; }
    }
}
