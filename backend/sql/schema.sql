-- Schema matching Chapter 3 (ตารางที่ 3.1 - 3.6) of the thesis, extended with
-- auth-related columns (password_hash) needed for real login.

CREATE TABLE IF NOT EXISTS tb_user (
  user_id      SERIAL PRIMARY KEY,
  line_id      VARCHAR(50) UNIQUE,           -- LINE userId (LIFF profile), null for staff-only accounts
  name         VARCHAR(100) NOT NULL,
  phone        VARCHAR(10),
  email        VARCHAR(100),
  created_at   TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tb_operator (
  operator_id    SERIAL PRIMARY KEY,
  username       VARCHAR(50) UNIQUE NOT NULL,
  password_hash  VARCHAR(255) NOT NULL,
  name           VARCHAR(100) NOT NULL,
  phone          VARCHAR(10),
  email          VARCHAR(100),
  status         VARCHAR(20) DEFAULT 'active', -- active | inactive
  created_at     TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tb_technician (
  technician_id  SERIAL PRIMARY KEY,
  username       VARCHAR(50) UNIQUE NOT NULL,
  password_hash  VARCHAR(255) NOT NULL,
  name           VARCHAR(100) NOT NULL,
  phone          VARCHAR(10),
  email          VARCHAR(100),
  specialty      VARCHAR(100),               -- e.g. ไฟฟ้า / ประปา / ถนน
  status         VARCHAR(20) DEFAULT 'active',
  created_at     TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tb_repairstatus (
  status_id    SERIAL PRIMARY KEY,
  status_code  VARCHAR(30) UNIQUE NOT NULL, -- reported | accepted | assigned | in_progress | completed | cancelled
  status_name  VARCHAR(50) NOT NULL
);

CREATE TABLE IF NOT EXISTS tb_repairrequest (
  request_id      VARCHAR(20) PRIMARY KEY,     -- e.g. SR2026-045 (matches frontend id format)
  user_id         INT REFERENCES tb_user(user_id),
  repair_type     VARCHAR(50) NOT NULL,        -- electricity | water | road | streetlight | drainage | other
  title           VARCHAR(150) NOT NULL,
  problem_desc    TEXT,
  reporter_name   VARCHAR(100),                -- name of the person reporting (may differ from the LINE account holder — e.g. a relative reporting for an elderly parent)
  community       VARCHAR(100),
  location_name   VARCHAR(150),
  latitude        DECIMAL,
  longitude       DECIMAL,
  priority        VARCHAR(20) DEFAULT 'normal', -- low | normal | high | urgent
  contact_phone   VARCHAR(10),
  images_before    TEXT[],                       -- array of image URLs
  images_after     TEXT[],
  repair_result   TEXT,
  status_code     VARCHAR(30) DEFAULT 'reported' REFERENCES tb_repairstatus(status_code),
  created_at      TIMESTAMP DEFAULT NOW(),
  updated_at      TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tb_repairassignment (
  assignment_id    SERIAL PRIMARY KEY,
  request_id       VARCHAR(20) REFERENCES tb_repairrequest(request_id),
  technician_id    INT REFERENCES tb_technician(technician_id),
  operator_id      INT REFERENCES tb_operator(operator_id),
  assigned_date    TIMESTAMP DEFAULT NOW(),
  completed_date   TIMESTAMP,
  status           VARCHAR(20) DEFAULT 'pending', -- pending | accepted | rejected
  note             TEXT,
  rating           INT
);

CREATE TABLE IF NOT EXISTS tb_notification (
  notification_id  SERIAL PRIMARY KEY,
  recipient_role    VARCHAR(20) NOT NULL,        -- citizen | operator | technician
  recipient_id      INT NOT NULL,                -- user_id / operator_id / technician_id depending on recipient_role
  request_id        VARCHAR(20) REFERENCES tb_repairrequest(request_id),
  type              VARCHAR(20) NOT NULL DEFAULT 'info', -- info | success
  title             VARCHAR(150) NOT NULL,
  message           TEXT,
  is_read           BOOLEAN DEFAULT FALSE,
  created_at        TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_repairrequest_status ON tb_repairrequest(status_code);
CREATE INDEX IF NOT EXISTS idx_repairrequest_user ON tb_repairrequest(user_id);
CREATE INDEX IF NOT EXISTS idx_assignment_technician ON tb_repairassignment(technician_id);
CREATE INDEX IF NOT EXISTS idx_notification_recipient ON tb_notification(recipient_role, recipient_id);
CREATE INDEX IF NOT EXISTS idx_notification_created ON tb_notification(created_at DESC);