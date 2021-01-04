import {ISelectItem} from '@/visuals/model/iselectitem';

export class SVItem implements ISelectItem {
  // ID and FKs
  idAdminSchluesselverzeichnis: number;
  fkAdminSchluesselgruppe: number;
  fkUserMandant: number;

  // Meta-Data
  createtime: Date;
  createuser: string;
  locktime: Date;
  lockuser: string;
  modifytime: Date;
  modifyuser: string;
  deleted: number;
  readonly: number;

  // interface ISelectItem
  value: string;
  label: string;

  // key: string;
  text: string;
  sort: number;
  svid: number;
  visible: number;
  mandant: number;

  double1: number;
  double2: number;
  double3: number;
  key1: string;
  key2: string;
  key3: string;
  long1: number;
  long2: number;
  long3: number;
}

// private long idAdminSchluesselverzeichnis;
// private Long fkAdminSchluesselgruppe;
// private Long fkUserMandant;

// private Date createtime;
// private String createuser;
// private Date modifytime;
// private String modifyuser;
// private Date locktime;
// private String lockuser;
// private long deleted;
// private long readonly;

// private String text;
// private Long sort;
// private Long svid;
// private Long visible;
// private BigDecimal mandant;

// private Double double1;
// private Double double2;
// private Double double3;
// private String key1;
// private String key2;
// private String key3;
// private BigDecimal long1;
// private BigDecimal long2;
// private BigDecimal long3;
