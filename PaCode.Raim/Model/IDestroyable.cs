namespace PaCode.Raim.Model
{
    internal interface IDestroyable
    {
        int TimeToLive { get; set; }
        bool IsDestroyed { get; }
    }
}