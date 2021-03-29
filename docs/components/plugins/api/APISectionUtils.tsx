import React from 'react';
import ReactMarkdown from 'react-markdown';

import { InlineCode } from '~/components/base/code';
import { InternalLink } from '~/components/base/link';
import { LI, UL } from '~/components/base/list';
import { B, P, Quote } from '~/components/base/paragraph';

export enum TypeDocKind {
  Enum = 4,
  Function = 64,
  Class = 128,
  Interface = 256,
  Property = 1024,
  TypeAlias = 4194304,
}

export const renderers: React.ComponentProps<typeof ReactMarkdown>['renderers'] = {
  blockquote: ({ children }) => <Quote>{children}</Quote>,
  inlineCode: ({ value }) => <InlineCode>{value}</InlineCode>,
  list: ({ children }) => <UL>{children}</UL>,
  listItem: ({ children }) => <LI>{children}</LI>,
  link: ({ href, children }) => <InternalLink href={href}>{children}</InternalLink>,
  paragraph: ({ children }) => (children ? <P>{children}</P> : null),
  text: ({ value }) => (value ? <span>{value}</span> : null),
};

export const inlineRenderers: React.ComponentProps<typeof ReactMarkdown>['renderers'] = {
  ...renderers,
  paragraph: ({ children }) => (children ? <span>{children}</span> : null),
};

export type CommentData = {
  text?: string;
  shortText?: string;
  returns?: string;
  tags?: CommentTagData[];
};

export type CommentTagData = {
  tag: string;
  text: string;
};

export type TypeDefinitionData = {
  name: string;
  type: string;
  elementType?: {
    name: string;
  };
  queryType?: {
    name: string;
  };
  typeArguments?: TypeDefinitionData[];
};

export type MethodParamData = {
  name: string;
  type: TypeDefinitionData;
  comment?: CommentData;
};

export const resolveTypeName = ({
  elementType,
  name,
  type,
  typeArguments,
}: TypeDefinitionData): string | JSX.Element => {
  if (name) {
    if (type === 'reference') {
      if (typeArguments) {
        if (name === 'Promise') {
          return (
            <span>
              {'Promise<'}
              {typeArguments.map(resolveTypeName)}
              {'>'}
            </span>
          );
        } else {
          return `${typeArguments.map(resolveTypeName)}`;
        }
      } else {
        if (name === 'Date') {
          return name;
        } else {
          return (
            <InternalLink href={`#${name.toLowerCase()}`} key={`type-link-${name}`}>
              {name}
            </InternalLink>
          );
        }
      }
    } else {
      return name;
    }
  } else if (elementType?.name) {
    if (type === 'array') {
      return elementType.name + '[]';
    }
    return elementType.name + type;
  }
  return 'undefined';
};

export const renderParam = ({ comment, name, type }: MethodParamData): JSX.Element => (
  <LI key={`param-${name}`}>
    <B>
      {name} (<InlineCode>{resolveTypeName(type)}</InlineCode>)
    </B>
    <CommentTextBlock comment={comment} renderers={inlineRenderers} withDash />
  </LI>
);

type CommentTextBlockProps = {
  comment?: CommentData;
  renderers?: React.ComponentProps<typeof ReactMarkdown>['renderers'];
  withDash?: boolean;
};

export const CommentTextBlock: React.FC<CommentTextBlockProps> = ({
  comment,
  renderers,
  withDash,
}) => {
  const shortText = comment?.shortText ? (
    <ReactMarkdown renderers={renderers}>{comment.shortText}</ReactMarkdown>
  ) : null;
  const text = comment?.text ? (
    <ReactMarkdown renderers={renderers}>{comment.text}</ReactMarkdown>
  ) : null;
  return (
    <>
      {withDash && (shortText || text) ? ' - ' : null}
      {shortText}
      {text}
    </>
  );
};
