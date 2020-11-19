# The design of data store using Dynamodb.

## ER Diagrams

![ER](./ER-diagrams.drawio.svg)

### Requirement
- Store user's metadata of audio in the 'AudioMetaData' table.
- Store user's play list in the 'PlayList' table.
- Users can access only their own data.

## Use case list
| #   | Entity        | Use Case     |
| --- | ------------- | ------------ |
| 1   | AudioMetaData | getAudioFiles |
| 2   | AudioMetaData | getAudioFilesByAudioS3Path |
| 3   | AudioMetaData | getAudioFilesByArtist |
| 4   | AudioMetaData | getAudioFilesByAlbum |
| 5   | AudioMetaData | getAudioFilesSSbucketName |
| 6   | AudioMetaData | getArtist |
| 7   | AudioMetaData | getAlbum |
| 8   | PlayList | getPlaylist |

**Note**
Users can access to only their audio metadata.

## Schema definition
### Option1(not adopted ❌ )
Like RDB + multiple GSI
#### AudioMetaData Table
##### Table
| PrimaryKey || Attributes|||||||
|---|---|---|---|---|---|---|---|---|
| **PK,LSI-1-PK,LSI-2-PK,LSI-3-PK** | **SK** | **LSI-1-SK** | **LSI-2-SK** | **LIST-3-SK** | -| -|- | -|
| **UserEmail** | **AudioS3Path** | **Artist** | **Album** | **SSbucketName** | **AlbumArtWorkS3Path** | **AudioFileName** | **AccessKey** | **SecretAccessKey** |
| a@abc.com | s3://mybucket/aaa.mp3 | A | AlbumA | s3://mybucket/aaa.png | aaa | mybucket | AIJIJIGRXXX | jiAJFIadfgji|
| b@abc.com | s3://mybucket/bbb.mp3 | B | AlbumB | s3://mybucket/bbb.png | bbb | mybucket | AIJIJIGRYYY | yamARsdfagrea

##### Index
- LSI1
  Search by UserEmail and by Artist
    | LSI Partition Key || Projected Attributes|
    |---|---|---|---|
    | **LSI-1-PK,(Primary Table PK)** | **LSI-1-SK** | s | 
    | **UserEmail** | **Artist** | ***AllColumns*** | s |
- LSI2
  Search by UserEmail and Album
- LSI3
  Search by UserEmail and S3BucketName

**The Reason of not adopt**
It’s too expensive for development of personal.

### Option2(not adopted ❌ )
Using GSI Overloading
#### AudioMetaData Table
##### Table
| PrimaryKey || Attributes|
|---|---|---|---|
| **PK** | **SK** | **** | 
| **ID** | **DataType** | **DataValue** |
| {AudioS3Path} | UserEmail |{UserEmail}|
| {AudioS3Path} | AudioFileName |{AudioFileName}|
| {AudioS3Path} | Artist |{Artist}|
| {AudioS3Path} | Album |{Album}|
| {AudioS3Path} | AlbumArtWorkS3Path |{AlbumArtWorkS3Path}|
| {AudioS3Path} | AccessKey |{AccessKey}|
| {AudioS3Path} | SecretAccessKey |{SecretAccessKey}|
| {AudioS3Path} | PlayListIds | [{PlayListIds}] |

##### Index
- GSI1

    | GSI Partition Key || Projected Attributes|
    |---|---|---|---|
    | **GSI-1-PK** | **GSI-1-SK** | **Primary Table SK** | 
    | **DataValue** | **ID** | **DataType** |
    | {Users Email} | {AudioS3Path} | Users Email |
    | {Artist} | {AudioS3Path} | Artist|
    | {Album} | {AudioS3Path} | Album |


**It is impossible** when several users loading the same s3 path.


### Option3
Partition Key is User ID + S3 File Path
PKの段階でユーザ名とSSをガッシャーンしておく案

Startiwithをうまく使う

#### AudioMetaData Table
##### Table
| PrimaryKey || Attributes|
|---|---|---|---|
| **PK** | **SK** | **** | 
| **ID** | **DataType** | **DataValue** |
| **ID** | **DataType** | **DataValue** |


## Query condition definition