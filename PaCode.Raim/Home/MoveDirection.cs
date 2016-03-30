using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PaCode.Raim.Home
{
    [Flags]
    public enum MoveDirection
    {
        Up = 1,
        Down = 2,
        Left = 4,
        Right = 8
    }
}