import { AP_DISTRICTS, DistrictInfo, MandalInfo, VillageInfo } from './apLocations';

export const DEFAULT_DISTRICT_NAME = 'Nellore (SPSR Nellore)';

let loadedDistricts: DistrictInfo[] = AP_DISTRICTS;

export async function loadApLocations(): Promise<DistrictInfo[]> {
  // If already loaded, return immediately
  if (loadedDistricts && loadedDistricts.length > 0) {
    return loadedDistricts;
  }
  loadedDistricts = AP_DISTRICTS;
  return loadedDistricts;
}

export function getLoadedDistricts(): DistrictInfo[] {
  return loadedDistricts && loadedDistricts.length > 0 ? loadedDistricts : AP_DISTRICTS;
}

export function getMandalsForDistrict(districtName: string): MandalInfo[] {
  if (!districtName) return [];
  const districts = getLoadedDistricts();
  const d = districts.find(item =>
    item.name.toLowerCase() === districtName.toLowerCase() ||
    item.name.toLowerCase().includes(districtName.toLowerCase()) ||
    districtName.toLowerCase().includes(item.name.toLowerCase())
  );
  return d ? d.mandals : [];
}

export function getVillagesForMandal(districtName: string, mandalName: string): VillageInfo[] {
  if (!mandalName) return [];
  const mandals = getMandalsForDistrict(districtName);
  const m = mandals.find(item =>
    item.name.toLowerCase() === mandalName.toLowerCase() ||
    item.name.toLowerCase().includes(mandalName.toLowerCase())
  );
  return m ? m.villages : [];
}
