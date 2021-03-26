import React, { useContext } from 'react';

import DocumentationPageContext from '~/components/DocumentationPageContext';
import { P } from '~/components/base/paragraph';
import APISectionEnums, { EnumDefinitionData } from '~/components/plugins/api/APISectionEnums';
import APISectionMethods, {
  MethodDefinitionData,
} from '~/components/plugins/api/APISectionMethods';
import APISectionProps, {
  DefaultPropsDefinitionData,
  PropsDefinitionData,
} from '~/components/plugins/api/APISectionProps';
import APISectionTypes, { TypeGeneralData } from '~/components/plugins/api/APISectionTypes';
import { TypeDocKind } from '~/components/plugins/api/APISectionUtils';

const LATEST_VERSION = `v${require('~/package.json').version}`;

type Props = {
  packageName: string;
  apiName?: string;
};

type GeneratedData = EnumDefinitionData &
  MethodDefinitionData &
  PropsDefinitionData &
  DefaultPropsDefinitionData &
  TypeGeneralData;

const filterData = (
  entries: GeneratedData[],
  kind: TypeDocKind,
  additionalCondition: (entry: GeneratedData) => boolean = () => true
) =>
  entries
    ? entries.filter((entry: GeneratedData) => entry.kind === kind && additionalCondition(entry))
    : [];

const renderAPI = (
  packageName: string,
  version: string = 'unversioned',
  apiName?: string
): JSX.Element => {
  try {
    const data = require(`~/public/static/data/${version}/${packageName}.json`).children;

    const methods = filterData(data, TypeDocKind.Function);
    const types = filterData(
      data,
      TypeDocKind.TypeAlias,
      entry => !!(entry.type.declaration || entry.type.types)
    );
    const props = filterData(data, TypeDocKind.TypeAlias, entry => entry.name.includes('Props'));
    const defaultProps = filterData(
      data.filter(
        (defaultProp: DefaultPropsDefinitionData) => defaultProp.kind === TypeDocKind.Class
      )[0]?.children,
      TypeDocKind.Property,
      entry => entry.name === 'defaultProps'
    )[0];
    const enums = filterData(data, TypeDocKind.Enum);

    return (
      <div>
        <APISectionMethods data={methods} apiName={apiName} />
        <APISectionProps data={props} defaultProps={defaultProps} />
        <APISectionTypes data={types} />
        <APISectionEnums data={enums} />
      </div>
    );
  } catch (error) {
    return <P>No API data file found, sorry!</P>;
  }
};

const APISection: React.FC<Props> = ({ packageName, apiName }) => {
  const { version } = useContext(DocumentationPageContext);
  const resolvedVersion =
    version === 'unversioned' ? version : version === 'latest' ? LATEST_VERSION : version;
  return renderAPI(packageName, resolvedVersion, apiName);
};

export default APISection;
