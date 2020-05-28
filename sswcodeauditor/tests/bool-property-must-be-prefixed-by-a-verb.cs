// passed bool Car { get; set; }
// passed bool Moven { get; set; }
public bool CanDrive { get; set; }
// failed
public bool drive { get; set; }
public bool drive { get; private set; }