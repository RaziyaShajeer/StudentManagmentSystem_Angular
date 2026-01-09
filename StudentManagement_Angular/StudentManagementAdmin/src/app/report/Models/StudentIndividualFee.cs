namespace Domain.Services.Admin.DTOs
{
    public class StudentIndividualFee
    {
        public string StudentId { get; set; }
        public string StudentName { get; set; }

        public double PaidAmount { get; set; }
        public double Balance { get; set; }
        public double Overdue { get; set; }
        public double Total { get; set; }
    }
}
