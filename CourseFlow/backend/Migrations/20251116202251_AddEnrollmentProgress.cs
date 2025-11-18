using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CourseFlow.Migrations
{
    /// <inheritdoc />
    public partial class AddEnrollmentProgress : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CompletedLessons",
                table: "Enrollments",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "ProgressPercent",
                table: "Enrollments",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CompletedLessons",
                table: "Enrollments");

            migrationBuilder.DropColumn(
                name: "ProgressPercent",
                table: "Enrollments");
        }
    }
}
