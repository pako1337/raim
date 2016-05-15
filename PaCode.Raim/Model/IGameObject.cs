using System;

namespace PaCode.Raim.Model
{
    public interface IGameObject
    {
        Guid Id { get; }
        Vector2d Position { get; set; }
        Vector2d Speed { get; }
        Vector2d FacingDirection { get; }
        int Size { get; }
    }
}