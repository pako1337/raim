using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using PaCode.Raim.Model;

namespace PaCode.Raim.Home
{
    public class PlayerInput
    {
        public MoveDirection MoveDirection { get; set; }
        public Vector2d FacingDirection { get; set; }
    }
}