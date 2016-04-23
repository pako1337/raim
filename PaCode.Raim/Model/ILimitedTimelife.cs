namespace PaCode.Raim.Model
{
    interface ILimitedTimelife
    {
        int TimeToLive { get; }
        void RecordTimePassed(int miliseconds);
    }
}