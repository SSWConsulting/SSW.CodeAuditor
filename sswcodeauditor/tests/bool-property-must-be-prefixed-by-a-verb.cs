// passed bool Car { get; set; }
public bool CanDrive { get; set; }
// failed
public bool drive { get; set; }
public bool drive { get; private set; }