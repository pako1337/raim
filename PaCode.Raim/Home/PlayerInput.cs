﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using PaCode.Raim.Model;

namespace PaCode.Raim.Home
{
    public class PlayerInput
    {
        public KeysInput KeysInput { get; set; }
        public Vector2d FacingDirection { get; set; }
    }
}