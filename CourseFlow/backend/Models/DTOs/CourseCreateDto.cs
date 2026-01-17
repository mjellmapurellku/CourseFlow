public class CourseCreateDto
{
    public int Id { get; set; }
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public string Category { get; set; } = "";
    public string Level { get; set; } = "";
    public double? Rating { get; set; }
    public int? Students { get; set; }
    public string Duration { get; set; } = "";
    public decimal Price { get; set; }
    public string Image { get; set; } = "";
    public string VideoUrl { get; set; } = "";
    public int InstructorId { get; set; }
    public List<LessonDto>? Lessons { get; set; }

}
