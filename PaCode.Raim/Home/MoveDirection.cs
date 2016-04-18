using System;

namespace PaCode.Raim.Home
{
    [Flags]
    public enum KeysInput
    {
        Up = 1 << 0,
        Down = 1 << 1,
        Left = 1 << 2,
        Right = 1 << 3,
        MouseLeft = 1 << 4,
    }
}