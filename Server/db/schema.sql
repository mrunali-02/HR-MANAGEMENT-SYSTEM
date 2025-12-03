CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name ENUM('Admin', 'HR', 'Manager', 'Employee') NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firebase_uid VARCHAR(128) NOT NULL UNIQUE,
  employee_id VARCHAR(50) NOT NULL UNIQUE,
  role_id INT NOT NULL,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL,
  department VARCHAR(80),
  phone VARCHAR(30),
  joined_on DATE,
  avatar_color VARCHAR(16),
  photo_url VARCHAR(255),
  address VARCHAR(255),
  contact_number VARCHAR(40),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (role_id) REFERENCES roles(id)
);

CREATE TABLE IF NOT EXISTS device_logins (
  id INT AUTO_INCREMENT PRIMARY KEY,
  firebase_uid VARCHAR(128) NOT NULL,
  device_info VARCHAR(255),
  ip_address VARCHAR(64),
  logged_in_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (firebase_uid) REFERENCES employees(firebase_uid)
);

CREATE TABLE IF NOT EXISTS leave_balances (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id VARCHAR(50) NOT NULL,
  leave_type ENUM('Sick','Casual','Paid','Emergency') NOT NULL,
  total DECIMAL(5,2) NOT NULL DEFAULT 0,
  remaining DECIMAL(5,2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uniq_balance (employee_id, leave_type),
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

CREATE TABLE IF NOT EXISTS leave_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id VARCHAR(50) NOT NULL,
  leave_type ENUM('Sick','Casual','Paid','Emergency') NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days DECIMAL(5,2) NOT NULL,
  reason VARCHAR(500),
  status ENUM('Pending','Approved','Rejected') DEFAULT 'Pending',
  manager_remarks VARCHAR(500),
  emergency TINYINT(1) DEFAULT 0,
  reviewed_by VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

CREATE TABLE IF NOT EXISTS attendance_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employee_id VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  status ENUM('Present','Absent','Remote','On Leave','Correction Requested','Corrected') NOT NULL,
  check_in TIME,
  check_out TIME,
  work_hours DECIMAL(4,2),
  remarks VARCHAR(255),
  UNIQUE KEY uniq_attendance (employee_id, date),
  FOREIGN KEY (employee_id) REFERENCES employees(employee_id)
);

