using CourseFlow.backend.Models.DTOs;

namespace CourseFlow.backend.Models
{
    public class ChatRequest
    {
        public List<MessageDto> Messages { get; set; } = new();
    }
}
