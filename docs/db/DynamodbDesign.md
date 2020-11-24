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
| 1   | AudioMetaData | getAudioFilesByAudioId |
| 2   | AudioMetaData | getAudioIdByUserId |
| 3   | AudioMetaData | getAudioIdByUserIdByArtist |
| 4   | AudioMetaData | getAudioIdByUserIdByAlbum |
| 5   | AudioMetaData | getAudioIdByUserIdByS3bucketName |
| 6   | AudioMetaData | getArtistsByUserId |
| 7   | AudioMetaData | getAlbumByUserId |
| 8   | PlayList | getPlaylistIdsByUserId |

**Note**
Users can access to only their audio metadata.

## Schema definition
### Option1(not adopted ❌ )
Like RDB and haves multiple GSI.
#### AudioMetaData Table
##### Table
| PrimaryKey || Attributes|||||||
|---|---|---|---|---|---|---|---|---|
| **PK,LSI-1-PK,LSI-2-PK,LSI-3-PK** | **SK** | **LSI-1-SK** | **LSI-2-SK** | **LIST-3-SK** | -| -|- | -|
| **UserId** | **AudioS3Path** | **Artist** | **Album** | **SSbucketName** | **AlbumArtWorkS3Path** | **AudioFileName** | **AccessKey** | **SecretAccessKey** |
| A | s3://mybucket/aaa.mp3 | AC/DC | Back in Black | s3://mybucket/aaa.png | aaa | mybucket | AIJIJIGRXXX | jiAJFIadfgji|
| B | s3://mybucket/bbb.mp3 | Metallica | St.Anger | s3://mybucket/bbb.png | bbb | mybucket | AIJIJIGRYYY | yamARsdfagrea

##### Index
- LSI1
  Search by UserId and by Artist
    | LSI Partition Key || Projected Attributes|
    |---|---|---|
    | **LSI-1-PK,(Primary Table PK)** | **LSI-1-SK** | - |
    | **UserId** | **Artist** | ***RequiredColumns*** |
    |a@ab.com|AC/DC| {required columns} |
- LSI2
  Search by UserId and Album
- LSI3
  Search by UserId and S3BucketName

**The Reason of not adopt**
Requirements can be satisfied,
but need to multiple index and too expensive for personal development.

### Option2(not adopted ❌ )
Using GSI Overloading
#### AudioMetaData Table
##### Table
| PrimaryKey || Attributes|
|---|---|---|---|
| **PK** | **SK** | **** | 
| **ID** | **DataType** | **DataValue** |
| {AudioS3Path} | UserId | {UserId}|
| {AudioS3Path} | AudioFileName | {AudioFileName} |
| {AudioS3Path} | Artist | {Artist} |
| {AudioS3Path} | Album | {Album} |
| {AudioS3Path} | AlbumArtWorkS3Path | {AlbumArtWorkS3Path} |
| {AudioS3Path} | AccessKey | {AccessKey} |
| {AudioS3Path} | SecretAccessKey | {SecretAccessKey} |
| {AudioS3Path} | PlayListIds | [{PlayListIds}] |

##### Index
- GSI1

    | GSI Partition Key || Projected Attributes|
    |---|---|---|---|
    | **GSI-1-PK** | **GSI-1-SK** | **Primary Table SK** | 
    | **DataValue** | **ID** | **DataType** |
    | {UserId} | {AudioS3Path} | UserId |
    | {Artist} | {AudioS3Path} | Artist|
    | {Album} | {AudioS3Path} | Album |

**The Reason of not adopt**
Requirements can not be satisfied.
It is impossible when several users loading the same audio files.


### Option3(Adopted ✅ )
Using GSI Overloading and each audio id,
#### AudioMetaData Table
##### Table
| PrimaryKey || Attributes|||
|---|---|---|---|---|---|
| **PK,GSI-1-SK** | **SK,GSI-1-PK,GSI-2-SK** | - |  - | **GSI-2-PK** | 
| **ID** | **DataType** | **DataValue1** | **DataValue2** | **Owner** |
| {AudioId} | UserId | {UserId}| - | {UserId} | |
| {AudioId} | S3BucketName | {UserId}-{S3BucketName}| - | {UserId} |
| {AudioId} | AudioFileName | {UserId}-{AudioFileName}| - | {UserId} | 
| {AudioId} | Artist | {UserId}-{Artist}| - | {UserId} | 
| {AudioId} | Album | {UserId}-{Album}| - | {UserId} | 
| {AudioId} | AlbumArtWorkS3Path |{AlbumArtWorkS3Path}| - | {UserId} | 
| {AudioId} | AudioS3Path | {UserId}| - | {UserId} | 
| {AudioId} | AccessKey | {AccessKey}| - | {UserId} | 
| {AudioId} | SecretAccessKey | {SecretAccessKey} | - | {UserId} | 
| {AudioId} | PlayListId | {PlayListId} | {SortOrder} | {UserId} | 
| {PlayListId} | PlayListName | {PlayListName} | - | {UserId} | 
| {PlayListId} | PlayListAudios | {[PlayListAudios]]} | - | {UserId} | 

**Note**
Because the song name and album name may be same, 
should be use filter expression, after fetch datas.

##### Index
- GSI1

    | GSI Partition Key || Projected Attributes |
    |---|---|---|---|
    | **GSI-1-PK** | **GSI-1-SK** | **Primary Table SK** | 
    | **DataValue** | **DataType** | **ID** |
    | {UserId} | UserId |{AudioId} | 
    | {UserId}-{S3BucketName} | S3BucketName | {AudioId} | 
    | {UserId}-{Artist} | Artist | {AudioId} | 
    | {UserId}-{Album} | Album | {AudioId} | 

- GSI2

    | GSI Partition Key || Projected Attributes ||
    |---|---|---|---|---|
    | **GSI-2-PK** | **GSI-2-SK** | - | - | 
    | **Owner** |  **DataType** | **DataValue** | **ID**| 
    | {UserId} | S3BucketName | {S3BucketName} | {AudioId} |
    | {UserId} | Artist | {Artist} | {AudioId} |
    | {UserId} | Album | {Album} | {AudioId} |
    | {UserId} | PlayListName | {PlayListName} | {PlayListId} |
    | {UserId} | PlayListAudios | {[PlayListAudios]]} | {PlayListId} |

Many to many の考え方、
Audio側でもPlayListIdを持って、playlist側でもAudioをもつ？
playlistName入らなくて、別フィールドとして持たせるだけでいいのでは？

## Query condition definition

##### Table
| # | Entity | Use Case | Parameters | Table/Index | API & Key Conditions |
|---|---|---|---|---|---|
| 1   | AudioMetaData | getAudioFilesByAudioId | {AuidioId} | Primary Table | Query(ID = :AudioId) |
| 2   | AudioMetaData | getAudioIdByUserId | {UserId} | GSI-1 | Query(DataValue = :UserId) |
| 3   | AudioMetaData | getAudioIdByUserIdByArtist | {UserId}-{Artist} | GSI-1 | Query(DataValue = :{UserId}-{Artist}) |
| 4   | AudioMetaData | getAudioIdByUserIdByAlbum | {UserId}-{Album} | GSI-1 | Query(DataValue = :{UserId}-{Album}) |
| 5   | AudioMetaData | getAudioIdByUserIdByS3bucketName | {UserId}-{S3BucketName}  | GSI-1 | Query(DataValue = :{UserId}-{S3BucketName}) |
| 6   | AudioMetaData | getArtistsByUserId | {UserId} | GSI-2 | Query(Owner = :{UserId} and DataType = 'Artist')|
| 7   | AudioMetaData | getAlbumsByUserId | {UserId} | GSI-2 | Query(Owner = :{UserId} and DataType = 'Album')|
| 8   | PlayList | getPlaylistIdsByUserId |　 {UserId} | GSI-2 | Query(Owner = :{UserId} and DataType = 'PlayListName')|