import { TitleWithIcon } from '@/components/TitleWithIcon';
import AddAdmin from './AddAdmin';
import SplitsMenu from '../../finanzas/_components/SplitsMenu';

export default function Admin({ titleSettingsProps, authUser }) {
  return (
    <div>
      <section>
        <TitleWithIcon {...titleSettingsProps.repartos} />
        <SplitsMenu />
        <TitleWithIcon {...titleSettingsProps.roles} />
        <AddAdmin authUser={authUser} />
      </section>
    </div>
  );
}
